"""Admin dashboard API routes."""

from datetime import date, timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentAdmin
from src.database import get_db
from src.admin.schemas import (
    DashboardStats,
    DashboardWidgets,
    SalesAnalytics,
    LowStockProduct,
    TopProduct,
    BulkStockUpdate,
    BulkStockUpdateItem,
)
from src.admin.service import (
    get_dashboard_stats,
    get_low_stock_products,
    get_recent_orders,
    get_sales_analytics,
    get_top_products,
)
from src.services.inventory.service import InventoryService

router = APIRouter(prefix="/admin/dashboard", tags=["admin-dashboard"])


@router.get(
    "/stats",
    response_model=DashboardStats,
    operation_id="adminGetDashboardStats",
)
async def get_stats(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DashboardStats:
    """Get dashboard overview statistics."""
    return await get_dashboard_stats(db)


@router.get(
    "/widgets",
    response_model=DashboardWidgets,
    operation_id="adminGetDashboardWidgets",
)
async def get_widgets(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> DashboardWidgets:
    """Get all dashboard widgets data in one call."""
    stats = await get_dashboard_stats(db)
    top_products = await get_top_products(db, limit=5)
    low_stock = await get_low_stock_products(db, limit=5)
    recent_orders = await get_recent_orders(db, limit=5)

    return DashboardWidgets(
        stats=stats,
        top_products=top_products,
        low_stock_products=low_stock,
        recent_orders=recent_orders,
    )


@router.get(
    "/analytics",
    response_model=SalesAnalytics,
    operation_id="adminGetSalesAnalytics",
)
async def get_analytics(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    start_date: Annotated[date | None, Query()] = None,
    end_date: Annotated[date | None, Query()] = None,
) -> SalesAnalytics:
    """Get sales analytics for a date range."""
    # Default to last 30 days
    if not end_date:
        end_date = date.today()
    if not start_date:
        start_date = end_date - timedelta(days=30)

    return await get_sales_analytics(db, start_date, end_date)


@router.get(
    "/low-stock",
    response_model=list[LowStockProduct],
    operation_id="adminGetLowStockProducts",
)
async def get_low_stock(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=50)] = 20,
) -> list[LowStockProduct]:
    """Get products with low stock levels."""
    return await get_low_stock_products(db, limit=limit)


@router.get(
    "/top-products",
    response_model=list[TopProduct],
    operation_id="adminGetTopProducts",
)
async def get_top(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: Annotated[int, Query(ge=1, le=20)] = 5,
    days: Annotated[int, Query(ge=1, le=365)] = 30,
) -> list[TopProduct]:
    """Get top selling products."""
    return await get_top_products(db, limit=limit, days=days)


@router.post(
    "/inventory/bulk-update",
    response_model=dict,
    operation_id="adminBulkUpdateStock",
)
async def bulk_update_stock(
    data: BulkStockUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Bulk update stock quantities for multiple products."""
    inventory_service = InventoryService(db)
    updated_count = 0
    errors = []

    for update in data.updates:
        try:
            item = BulkStockUpdateItem(**update)
            result = await inventory_service.update_stock(
                item.product_id,
                item.new_quantity,
            )
            if result:
                updated_count += 1
            else:
                errors.append(f"Product {item.product_id} not found")
        except Exception as e:
            errors.append(f"Product {update.get('product_id', '?')}: {str(e)}")

    return {
        "updated_count": updated_count,
        "errors": errors,
    }
