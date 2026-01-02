"""Order customer API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentUser
from src.cart.dependencies import CurrentCart
from src.cart.service import clear_cart
from src.database import get_db
from src.orders.schemas import (
    OrderCancelRequest,
    OrderCreate,
    OrderListResponse,
    OrderResponse,
    PaginatedOrders,
)
from src.orders.service import (
    cancel_order,
    create_order_from_cart,
    get_order_by_number,
    get_orders_by_user,
)

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post(
    "",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createOrder",
)
async def create_order(
    order_data: OrderCreate,
    cart: CurrentCart,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderResponse:
    """Create a new order from the current cart."""
    try:
        order = await create_order_from_cart(
            db, cart, order_data, user_id=current_user.id
        )
        # Clear the cart after successful order
        await clear_cart(db, cart)
        return order
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.get(
    "",
    response_model=PaginatedOrders,
    operation_id="listOrders",
)
async def list_orders(
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> PaginatedOrders:
    """List orders for the current user."""
    orders, total = await get_orders_by_user(db, current_user.id, page, page_size)

    # Convert to list response with item count
    items = []
    for order in orders:
        items.append(
            OrderListResponse(
                id=order.id,
                order_number=order.order_number,
                status=order.status,
                payment_status=order.payment_status,
                fulfillment_type=order.fulfillment_type,
                requested_date=order.requested_date,
                total=order.total,
                item_count=len(order.items),
                created_at=order.created_at,
            )
        )

    total_pages = (total + page_size - 1) // page_size
    return PaginatedOrders(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get(
    "/{order_number}",
    response_model=OrderResponse,
    operation_id="getOrder",
)
async def get_order(
    order_number: str,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderResponse:
    """Get a specific order by order number."""
    order = await get_order_by_number(db, order_number, current_user.id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order


@router.post(
    "/{order_number}/cancel",
    response_model=OrderResponse,
    operation_id="cancelOrder",
)
async def cancel_order_endpoint(
    order_number: str,
    cancel_data: OrderCancelRequest,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderResponse:
    """Cancel an order (if allowed)."""
    order = await get_order_by_number(db, order_number, current_user.id)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    try:
        cancelled = await cancel_order(db, order, cancel_data.reason)
        return cancelled
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )
