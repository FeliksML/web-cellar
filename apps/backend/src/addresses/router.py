"""Address API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.addresses.schemas import AddressCreate, AddressResponse, AddressUpdate
from src.addresses.service import (
    create_address,
    delete_address,
    get_address_by_id,
    get_addresses_by_user,
    set_default_address,
    update_address,
)
from src.auth.dependencies import CurrentUser
from src.database import get_db

router = APIRouter(prefix="/addresses", tags=["addresses"])


@router.get(
    "",
    response_model=list[AddressResponse],
    operation_id="listAddresses",
)
async def list_addresses(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    address_type: Annotated[str | None, Query()] = None,
) -> list[AddressResponse]:
    """List all addresses for the current user."""
    addresses = await get_addresses_by_user(db, current_user.id, address_type)
    return addresses


@router.post(
    "",
    response_model=AddressResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createAddress",
)
async def create_new_address(
    current_user: CurrentUser,
    address_data: AddressCreate,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AddressResponse:
    """Create a new address for the current user."""
    address = await create_address(db, current_user.id, address_data)
    return address


@router.get(
    "/{address_id}",
    response_model=AddressResponse,
    operation_id="getAddress",
)
async def get_address(
    address_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AddressResponse:
    """Get a specific address by ID."""
    address = await get_address_by_id(db, address_id, current_user.id)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )
    return address


@router.put(
    "/{address_id}",
    response_model=AddressResponse,
    operation_id="updateAddress",
)
async def update_existing_address(
    address_id: int,
    address_data: AddressUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AddressResponse:
    """Update an existing address."""
    address = await get_address_by_id(db, address_id, current_user.id)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )

    updated = await update_address(db, address, address_data)
    return updated


@router.delete(
    "/{address_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteAddress",
)
async def delete_existing_address(
    address_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Delete an address."""
    address = await get_address_by_id(db, address_id, current_user.id)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )

    await delete_address(db, address)


@router.post(
    "/{address_id}/set-default",
    response_model=AddressResponse,
    operation_id="setDefaultAddress",
)
async def set_address_as_default(
    address_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> AddressResponse:
    """Set an address as the default for its type."""
    address = await get_address_by_id(db, address_id, current_user.id)
    if not address:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Address not found",
        )

    updated = await set_default_address(db, address)
    return updated
