"""Cart API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentUser
from src.cart.dependencies import CurrentCart
from src.cart.schemas import (
    CartDeliveryUpdate,
    CartItemCreate,
    CartItemResponse,
    CartItemUpdate,
    CartMergeRequest,
    CartResponse,
)
from src.cart.service import (
    add_item_to_cart,
    clear_cart,
    get_cart_item_by_id,
    merge_guest_cart,
    remove_cart_item,
    update_cart_delivery,
    update_cart_item,
)
from src.database import get_db

router = APIRouter(prefix="/cart", tags=["cart"])


@router.get(
    "",
    response_model=CartResponse,
    operation_id="getCart",
)
async def get_cart(cart: CurrentCart) -> CartResponse:
    """Get the current cart."""
    return cart


@router.post(
    "/items",
    response_model=CartItemResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="addCartItem",
)
async def add_item(
    item_data: CartItemCreate,
    cart: CurrentCart,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CartItemResponse:
    """Add an item to the cart."""
    try:
        item = await add_item_to_cart(db, cart, item_data)
        return item
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put(
    "/items/{item_id}",
    response_model=CartItemResponse,
    operation_id="updateCartItem",
)
async def update_item(
    item_id: int,
    item_data: CartItemUpdate,
    cart: CurrentCart,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CartItemResponse:
    """Update a cart item's quantity or instructions."""
    item = await get_cart_item_by_id(db, item_id, cart.id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    try:
        updated = await update_cart_item(db, item, item_data)
        return updated
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.delete(
    "/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="removeCartItem",
)
async def remove_item(
    item_id: int,
    cart: CurrentCart,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Remove an item from the cart."""
    item = await get_cart_item_by_id(db, item_id, cart.id)
    if not item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Cart item not found",
        )

    await remove_cart_item(db, item)


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="clearCart",
)
async def clear_cart_items(
    cart: CurrentCart,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Clear all items from the cart."""
    await clear_cart(db, cart)


@router.put(
    "/delivery",
    response_model=CartResponse,
    operation_id="updateCartDelivery",
)
async def update_delivery(
    delivery_data: CartDeliveryUpdate,
    cart: CurrentCart,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CartResponse:
    """Update cart delivery preferences."""
    updated = await update_cart_delivery(db, cart, delivery_data)
    return updated


@router.post(
    "/merge",
    response_model=CartResponse,
    operation_id="mergeCart",
)
async def merge_cart(
    merge_data: CartMergeRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CartResponse:
    """Merge a guest cart into the current user's cart."""
    cart = await merge_guest_cart(db, current_user.id, merge_data.session_id)
    return cart
