"""Order admin API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentAdmin
from src.database import get_db
from src.orders.schemas import (
    OrderFilters,
    OrderListResponse,
    OrderNotesUpdate,
    OrderResponse,
    OrderStatusUpdate,
    PaginatedOrders,
)
from src.orders.service import (
    get_all_orders,
    get_order_by_number,
    update_order_notes,
    update_order_status,
)

router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])


@router.get(
    "",
    response_model=PaginatedOrders,
    operation_id="adminListOrders",
)
async def list_all_orders(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    status: Annotated[str | None, Query()] = None,
    payment_status: Annotated[str | None, Query()] = None,
    fulfillment_type: Annotated[str | None, Query()] = None,
    search: Annotated[str | None, Query()] = None,
) -> PaginatedOrders:
    """List all orders with filters (admin only)."""
    filters = OrderFilters(
        status=status,
        payment_status=payment_status,
        fulfillment_type=fulfillment_type,
        search=search,
    )

    orders, total = await get_all_orders(db, filters, page, page_size)

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
    operation_id="adminGetOrder",
)
async def get_order(
    order_number: str,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderResponse:
    """Get a specific order (admin only)."""
    order = await get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )
    return order


@router.put(
    "/{order_number}/status",
    response_model=OrderResponse,
    operation_id="adminUpdateOrderStatus",
)
async def update_status(
    order_number: str,
    status_data: OrderStatusUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderResponse:
    """Update order status (admin only)."""
    order = await get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    try:
        updated = await update_order_status(db, order, status_data)
        return updated
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put(
    "/{order_number}/notes",
    response_model=OrderResponse,
    operation_id="adminUpdateOrderNotes",
)
async def update_notes(
    order_number: str,
    notes_data: OrderNotesUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> OrderResponse:
    """Update order internal notes (admin only)."""
    order = await get_order_by_number(db, order_number)
    if not order:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Order not found",
        )

    updated = await update_order_notes(db, order, notes_data.internal_notes)
    return updated
