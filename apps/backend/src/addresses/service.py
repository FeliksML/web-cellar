"""Address service layer for business logic."""

from sqlalchemy import select, update
from sqlalchemy.ext.asyncio import AsyncSession

from src.addresses.models import Address
from src.addresses.schemas import AddressCreate, AddressUpdate


async def get_addresses_by_user(
    db: AsyncSession,
    user_id: int,
    address_type: str | None = None,
) -> list[Address]:
    """Get all addresses for a user, optionally filtered by type."""
    query = select(Address).where(Address.user_id == user_id)
    if address_type:
        query = query.where(Address.address_type == address_type)
    query = query.order_by(Address.is_default.desc(), Address.created_at.desc())
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_address_by_id(
    db: AsyncSession,
    address_id: int,
    user_id: int | None = None,
) -> Address | None:
    """Get an address by ID, optionally filtering by user."""
    query = select(Address).where(Address.id == address_id)
    if user_id is not None:
        query = query.where(Address.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().first()


async def get_default_address(
    db: AsyncSession,
    user_id: int,
    address_type: str = "shipping",
) -> Address | None:
    """Get the user's default address of the specified type."""
    query = (
        select(Address)
        .where(Address.user_id == user_id)
        .where(Address.address_type == address_type)
        .where(Address.is_default.is_(True))
    )
    result = await db.execute(query)
    return result.scalars().first()


async def create_address(
    db: AsyncSession,
    user_id: int,
    address_data: AddressCreate,
) -> Address:
    """Create a new address for a user."""
    # If this is set as default, unset any existing default of the same type
    if address_data.is_default:
        await _unset_default_addresses(db, user_id, address_data.address_type)

    # If this is the first address of this type, make it default
    existing = await get_addresses_by_user(db, user_id, address_data.address_type)
    is_first = len(existing) == 0

    address = Address(
        user_id=user_id,
        **address_data.model_dump(),
    )
    if is_first:
        address.is_default = True

    db.add(address)
    await db.commit()
    await db.refresh(address)
    return address


async def update_address(
    db: AsyncSession,
    address: Address,
    address_data: AddressUpdate,
) -> Address:
    """Update an existing address."""
    update_dict = address_data.model_dump(exclude_unset=True)

    # If setting as default, unset any existing default of the same type
    if update_dict.get("is_default"):
        address_type = update_dict.get("address_type", address.address_type)
        await _unset_default_addresses(db, address.user_id, address_type)

    for field, value in update_dict.items():
        setattr(address, field, value)

    await db.commit()
    await db.refresh(address)
    return address


async def delete_address(db: AsyncSession, address: Address) -> None:
    """Delete an address."""
    was_default = address.is_default
    address_type = address.address_type
    user_id = address.user_id

    await db.delete(address)
    await db.commit()

    # If we deleted the default, set a new one if any exist
    if was_default:
        remaining = await get_addresses_by_user(db, user_id, address_type)
        if remaining:
            remaining[0].is_default = True
            await db.commit()


async def set_default_address(
    db: AsyncSession,
    address: Address,
) -> Address:
    """Set an address as the default for its type."""
    await _unset_default_addresses(db, address.user_id, address.address_type)
    address.is_default = True
    await db.commit()
    await db.refresh(address)
    return address


async def _unset_default_addresses(
    db: AsyncSession,
    user_id: int,
    address_type: str,
) -> None:
    """Unset all default flags for a user's addresses of a given type."""
    await db.execute(
        update(Address)
        .where(Address.user_id == user_id)
        .where(Address.address_type == address_type)
        .where(Address.is_default.is_(True))
        .values(is_default=False)
    )
