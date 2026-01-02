"""Cart service layer for business logic."""

from datetime import datetime, timedelta
from decimal import Decimal

from sqlalchemy import delete, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.cart.models import Cart, CartItem
from src.cart.schemas import CartDeliveryUpdate, CartItemCreate, CartItemUpdate
from src.products.models import Product


async def get_cart_by_user(db: AsyncSession, user_id: int) -> Cart | None:
    """Get cart for an authenticated user."""
    query = (
        select(Cart)
        .where(Cart.user_id == user_id)
        .options(selectinload(Cart.items).selectinload(CartItem.product))
    )
    result = await db.execute(query)
    return result.scalars().first()


async def get_cart_by_session(db: AsyncSession, session_id: str) -> Cart | None:
    """Get cart for a guest session."""
    query = (
        select(Cart)
        .where(Cart.session_id == session_id)
        .where(Cart.expires_at > datetime.utcnow())
        .options(selectinload(Cart.items).selectinload(CartItem.product))
    )
    result = await db.execute(query)
    return result.scalars().first()


async def get_or_create_cart(
    db: AsyncSession,
    user_id: int | None = None,
    session_id: str | None = None,
) -> Cart:
    """Get existing cart or create a new one."""
    cart = None

    if user_id:
        cart = await get_cart_by_user(db, user_id)
    elif session_id:
        cart = await get_cart_by_session(db, session_id)

    if not cart:
        cart = Cart(
            user_id=user_id,
            session_id=session_id if not user_id else None,
            expires_at=(
                datetime.utcnow() + timedelta(days=7) if not user_id else None
            ),
        )
        db.add(cart)
        await db.commit()
        await db.refresh(cart)

    return cart


async def add_item_to_cart(
    db: AsyncSession,
    cart: Cart,
    item_data: CartItemCreate,
) -> CartItem:
    """Add an item to the cart or update quantity if already exists."""
    # Get product to validate and get price
    product = await db.get(Product, item_data.product_id)
    if not product:
        raise ValueError("Product not found")
    if not product.is_active:
        raise ValueError("Product is not available")
    if not product.is_in_stock:
        raise ValueError("Product is out of stock")

    # Validate quantity against product constraints
    quantity = item_data.quantity
    if product.minimum_quantity and quantity < product.minimum_quantity:
        raise ValueError(f"Minimum order quantity is {product.minimum_quantity}")
    if product.quantity_increment and quantity % product.quantity_increment != 0:
        raise ValueError(f"Quantity must be in increments of {product.quantity_increment}")

    # Check if item already exists in cart
    existing_item = None
    for item in cart.items:
        if item.product_id == item_data.product_id:
            # Only merge if no special instructions or same instructions
            if item.special_instructions == item_data.special_instructions:
                existing_item = item
                break

    if existing_item:
        existing_item.quantity += quantity
        existing_item.updated_at = datetime.utcnow()
        await db.commit()
        await db.refresh(existing_item)
        return existing_item
    else:
        new_item = CartItem(
            cart_id=cart.id,
            product_id=item_data.product_id,
            quantity=quantity,
            unit_price=product.price,
            special_instructions=item_data.special_instructions,
        )
        db.add(new_item)
        await db.commit()
        await db.refresh(new_item)
        return new_item


async def update_cart_item(
    db: AsyncSession,
    item: CartItem,
    item_data: CartItemUpdate,
) -> CartItem:
    """Update a cart item's quantity or instructions."""
    if item_data.quantity is not None:
        # Validate against product constraints
        product = await db.get(Product, item.product_id)
        if product:
            if product.minimum_quantity and item_data.quantity < product.minimum_quantity:
                raise ValueError(f"Minimum order quantity is {product.minimum_quantity}")
            if product.quantity_increment and item_data.quantity % product.quantity_increment != 0:
                raise ValueError(f"Quantity must be in increments of {product.quantity_increment}")
        item.quantity = item_data.quantity

    if item_data.special_instructions is not None:
        item.special_instructions = item_data.special_instructions

    item.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(item)
    return item


async def remove_cart_item(db: AsyncSession, item: CartItem) -> None:
    """Remove an item from the cart."""
    await db.delete(item)
    await db.commit()


async def clear_cart(db: AsyncSession, cart: Cart) -> None:
    """Remove all items from the cart."""
    await db.execute(delete(CartItem).where(CartItem.cart_id == cart.id))
    await db.commit()


async def update_cart_delivery(
    db: AsyncSession,
    cart: Cart,
    delivery_data: CartDeliveryUpdate,
) -> Cart:
    """Update cart delivery preferences."""
    if delivery_data.requested_delivery_date is not None:
        cart.requested_delivery_date = delivery_data.requested_delivery_date
    if delivery_data.delivery_time_slot is not None:
        cart.delivery_time_slot = delivery_data.delivery_time_slot

    cart.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(cart)
    return cart


async def merge_guest_cart(
    db: AsyncSession,
    user_id: int,
    session_id: str,
) -> Cart:
    """Merge a guest cart into a user's cart after login."""
    guest_cart = await get_cart_by_session(db, session_id)
    user_cart = await get_or_create_cart(db, user_id=user_id)

    if guest_cart and guest_cart.items:
        for guest_item in guest_cart.items:
            # Check if user cart already has this product
            existing = None
            for item in user_cart.items:
                if item.product_id == guest_item.product_id:
                    if item.special_instructions == guest_item.special_instructions:
                        existing = item
                        break

            if existing:
                existing.quantity += guest_item.quantity
            else:
                # Move item to user cart
                new_item = CartItem(
                    cart_id=user_cart.id,
                    product_id=guest_item.product_id,
                    quantity=guest_item.quantity,
                    unit_price=guest_item.unit_price,
                    special_instructions=guest_item.special_instructions,
                )
                db.add(new_item)

        # Copy delivery preferences if user cart doesn't have them
        if guest_cart.requested_delivery_date and not user_cart.requested_delivery_date:
            user_cart.requested_delivery_date = guest_cart.requested_delivery_date
        if guest_cart.delivery_time_slot and not user_cart.delivery_time_slot:
            user_cart.delivery_time_slot = guest_cart.delivery_time_slot

        # Delete guest cart
        await db.delete(guest_cart)

        await db.commit()
        await db.refresh(user_cart)

    return user_cart


async def get_cart_item_by_id(
    db: AsyncSession,
    item_id: int,
    cart_id: int,
) -> CartItem | None:
    """Get a cart item by ID, verifying it belongs to the specified cart."""
    query = (
        select(CartItem)
        .where(CartItem.id == item_id)
        .where(CartItem.cart_id == cart_id)
        .options(selectinload(CartItem.product))
    )
    result = await db.execute(query)
    return result.scalars().first()


async def cleanup_expired_carts(db: AsyncSession) -> int:
    """Clean up expired guest carts. Returns number deleted."""
    result = await db.execute(
        delete(Cart).where(Cart.expires_at < datetime.utcnow())
    )
    await db.commit()
    return result.rowcount
