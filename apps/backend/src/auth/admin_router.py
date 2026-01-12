"""Admin API routes for customer management."""

from datetime import datetime
from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.dependencies import CurrentAdmin
from src.auth.models import User
from src.database import get_db
from src.orders.models import Order


router = APIRouter(prefix="/admin/customers", tags=["admin-customers"])


class CustomerListResponse(BaseModel):
    """Customer item for admin list."""
    id: int
    email: str
    first_name: str | None
    last_name: str | None
    phone: str | None
    role: str
    is_active: bool
    order_count: int
    total_spent: Decimal
    last_order_date: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedCustomers(BaseModel):
    """Paginated customers response."""
    items: list[CustomerListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class CustomerDetail(BaseModel):
    """Detailed customer info."""
    id: int
    email: str
    first_name: str | None
    last_name: str | None
    phone: str | None
    role: str
    is_active: bool
    order_count: int
    total_spent: Decimal
    average_order_value: Decimal | None
    last_order_date: datetime | None
    created_at: datetime
    recent_orders: list[dict]

    class Config:
        from_attributes = True


@router.get(
    "",
    response_model=PaginatedCustomers,
    operation_id="adminListCustomers",
)
async def list_customers(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    search: Annotated[str | None, Query()] = None,
    has_orders: Annotated[bool | None, Query()] = None,
) -> PaginatedCustomers:
    """List all customers with order stats (admin only)."""
    # Subquery for order stats
    order_stats = (
        select(
            Order.user_id,
            func.count(Order.id).label("order_count"),
            func.sum(Order.total).label("total_spent"),
            func.max(Order.created_at).label("last_order"),
        )
        .where(Order.payment_status == "paid")
        .group_by(Order.user_id)
        .subquery()
    )

    query = (
        select(
            User,
            func.coalesce(order_stats.c.order_count, 0).label("order_count"),
            func.coalesce(order_stats.c.total_spent, 0).label("total_spent"),
            order_stats.c.last_order.label("last_order"),
        )
        .outerjoin(order_stats, User.id == order_stats.c.user_id)
        .where(User.role == "customer")  # Only customers, not admins
    )

    # Apply filters
    if search:
        search_term = f"%{search}%"
        query = query.where(
            (User.email.ilike(search_term)) |
            (User.first_name.ilike(search_term)) |
            (User.last_name.ilike(search_term))
        )

    if has_orders is True:
        query = query.where(order_stats.c.order_count > 0)
    elif has_orders is False:
        query = query.where(
            (order_stats.c.order_count.is_(None)) |
            (order_stats.c.order_count == 0)
        )

    # Count total
    count_subquery = query.subquery()
    count_total = (await db.execute(select(func.count()).select_from(count_subquery))).scalar() or 0

    # Paginate
    query = (
        query.order_by(order_stats.c.total_spent.desc().nullslast())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    result = await db.execute(query)
    rows = result.all()

    items = []
    for row in rows:
        user = row[0]
        items.append(CustomerListResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            phone=user.phone,
            role=user.role,
            is_active=user.is_active,
            order_count=row.order_count,
            total_spent=Decimal(str(row.total_spent or 0)),
            last_order_date=row.last_order,
            created_at=user.created_at,
        ))

    total_pages = (count_total + page_size - 1) // page_size
    return PaginatedCustomers(
        items=items,
        total=count_total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get(
    "/{customer_id}",
    response_model=CustomerDetail,
    operation_id="adminGetCustomer",
)
async def get_customer(
    customer_id: int,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CustomerDetail:
    """Get detailed customer info with recent orders (admin only)."""
    user = await db.get(User, customer_id)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Customer not found",
        )

    # Get order stats
    stats_query = select(
        func.count(Order.id),
        func.sum(Order.total),
        func.avg(Order.total),
        func.max(Order.created_at),
    ).where(Order.user_id == customer_id).where(Order.payment_status == "paid")

    stats_result = await db.execute(stats_query)
    stats = stats_result.first()

    order_count = stats[0] or 0
    total_spent = Decimal(str(stats[1] or 0))
    avg_value = Decimal(str(round(stats[2], 2))) if stats[2] else None
    last_order = stats[3]

    # Get recent orders
    orders_query = (
        select(Order)
        .where(Order.user_id == customer_id)
        .order_by(Order.created_at.desc())
        .limit(10)
    )
    orders_result = await db.execute(orders_query)
    orders = orders_result.scalars().all()

    recent_orders = [
        {
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "payment_status": order.payment_status,
            "total": str(order.total),
            "item_count": len(order.items),
            "created_at": order.created_at.isoformat(),
        }
        for order in orders
    ]

    return CustomerDetail(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        phone=user.phone,
        role=user.role,
        is_active=user.is_active,
        order_count=order_count,
        total_spent=total_spent,
        average_order_value=avg_value,
        last_order_date=last_order,
        created_at=user.created_at,
        recent_orders=recent_orders,
    )
