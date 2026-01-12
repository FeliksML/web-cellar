"""Admin dashboard service for analytics and statistics."""

from datetime import date, datetime, timedelta
from decimal import Decimal

from sqlalchemy import func, select, and_, case
from sqlalchemy.ext.asyncio import AsyncSession

from src.orders.models import Order, OrderItem
from src.products.models import Product
from src.reviews.models import Review
from src.admin.schemas import (
    DashboardStats,
    OrderStatusCount,
    TopProduct,
    LowStockProduct,
    RevenueByPeriod,
    SalesAnalytics,
)


async def get_dashboard_stats(db: AsyncSession) -> DashboardStats:
    """Get dashboard overview statistics."""
    today = date.today()
    week_start = today - timedelta(days=today.weekday())
    month_start = today.replace(day=1)
    
    # Previous periods for comparison
    prev_month_start = (month_start - timedelta(days=1)).replace(day=1)
    prev_month_end = month_start - timedelta(days=1)

    # Today's orders count
    orders_today_result = await db.execute(
        select(func.count(Order.id))
        .where(func.date(Order.created_at) == today)
    )
    orders_today = orders_today_result.scalar() or 0

    # Orders by status today
    status_counts_result = await db.execute(
        select(Order.status, func.count(Order.id))
        .where(func.date(Order.created_at) == today)
        .group_by(Order.status)
    )
    orders_today_by_status = [
        OrderStatusCount(status=status, count=count)
        for status, count in status_counts_result.all()
    ]

    # Revenue today
    revenue_today_result = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(func.date(Order.created_at) == today)
        .where(Order.payment_status == "paid")
    )
    revenue_today = Decimal(str(revenue_today_result.scalar() or 0))

    # Revenue this week
    revenue_week_result = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(func.date(Order.created_at) >= week_start)
        .where(Order.payment_status == "paid")
    )
    revenue_this_week = Decimal(str(revenue_week_result.scalar() or 0))

    # Revenue this month
    revenue_month_result = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(func.date(Order.created_at) >= month_start)
        .where(Order.payment_status == "paid")
    )
    revenue_this_month = Decimal(str(revenue_month_result.scalar() or 0))

    # Previous month revenue for growth calculation
    prev_revenue_result = await db.execute(
        select(func.coalesce(func.sum(Order.total), 0))
        .where(func.date(Order.created_at) >= prev_month_start)
        .where(func.date(Order.created_at) <= prev_month_end)
        .where(Order.payment_status == "paid")
    )
    prev_revenue = Decimal(str(prev_revenue_result.scalar() or 0))
    
    revenue_growth = None
    if prev_revenue > 0:
        revenue_growth = float((revenue_this_month - prev_revenue) / prev_revenue * 100)

    # Low stock count
    low_stock_result = await db.execute(
        select(func.count(Product.id))
        .where(Product.is_active.is_(True))
        .where(Product.track_inventory.is_(True))
        .where(Product.stock_quantity <= Product.low_stock_threshold)
        .where(Product.stock_quantity > 0)
    )
    low_stock_count = low_stock_result.scalar() or 0

    # Out of stock count
    out_of_stock_result = await db.execute(
        select(func.count(Product.id))
        .where(Product.is_active.is_(True))
        .where(Product.track_inventory.is_(True))
        .where(Product.stock_quantity == 0)
    )
    out_of_stock_count = out_of_stock_result.scalar() or 0

    # Pending reviews (not approved)
    pending_reviews_result = await db.execute(
        select(func.count(Review.id))
        .where(Review.is_approved.is_(False))
    )
    pending_reviews_count = pending_reviews_result.scalar() or 0

    # Pending orders
    pending_orders_result = await db.execute(
        select(func.count(Order.id))
        .where(Order.status == "pending")
    )
    pending_orders_count = pending_orders_result.scalar() or 0

    return DashboardStats(
        orders_today=orders_today,
        orders_today_by_status=orders_today_by_status,
        revenue_today=revenue_today,
        revenue_this_week=revenue_this_week,
        revenue_this_month=revenue_this_month,
        revenue_growth_percent=revenue_growth,
        low_stock_count=low_stock_count,
        out_of_stock_count=out_of_stock_count,
        pending_reviews_count=pending_reviews_count,
        pending_orders_count=pending_orders_count,
    )


async def get_top_products(
    db: AsyncSession,
    limit: int = 5,
    days: int = 30,
) -> list[TopProduct]:
    """Get top selling products by revenue."""
    since_date = date.today() - timedelta(days=days)

    result = await db.execute(
        select(
            Product.id,
            Product.name,
            Product.sku,
            func.sum(OrderItem.quantity).label("quantity_sold"),
            func.sum(OrderItem.subtotal).label("revenue"),
        )
        .join(OrderItem, OrderItem.product_id == Product.id)
        .join(Order, Order.id == OrderItem.order_id)
        .where(func.date(Order.created_at) >= since_date)
        .where(Order.payment_status == "paid")
        .group_by(Product.id, Product.name, Product.sku)
        .order_by(func.sum(OrderItem.subtotal).desc())
        .limit(limit)
    )

    products = []
    for row in result.all():
        # Get primary image
        product = await db.get(Product, row.id)
        image_url = product.primary_image_url if product else None
        
        products.append(TopProduct(
            product_id=row.id,
            name=row.name,
            sku=row.sku,
            quantity_sold=row.quantity_sold or 0,
            revenue=Decimal(str(row.revenue or 0)),
            image_url=image_url,
        ))

    return products


async def get_low_stock_products(
    db: AsyncSession,
    limit: int = 10,
) -> list[LowStockProduct]:
    """Get products with low or zero stock."""
    result = await db.execute(
        select(Product)
        .where(Product.is_active.is_(True))
        .where(Product.track_inventory.is_(True))
        .where(Product.stock_quantity <= Product.low_stock_threshold)
        .order_by(Product.stock_quantity.asc())
        .limit(limit)
    )

    products = []
    for product in result.scalars().all():
        products.append(LowStockProduct(
            id=product.id,
            name=product.name,
            sku=product.sku,
            stock_quantity=product.stock_quantity,
            low_stock_threshold=product.low_stock_threshold,
            image_url=product.primary_image_url,
        ))

    return products


async def get_sales_analytics(
    db: AsyncSession,
    start_date: date,
    end_date: date,
) -> SalesAnalytics:
    """Get sales analytics for a date range."""
    # Total revenue and orders
    totals_result = await db.execute(
        select(
            func.coalesce(func.sum(Order.total), 0).label("revenue"),
            func.count(Order.id).label("orders"),
        )
        .where(func.date(Order.created_at) >= start_date)
        .where(func.date(Order.created_at) <= end_date)
        .where(Order.payment_status == "paid")
    )
    totals = totals_result.one()
    total_revenue = Decimal(str(totals.revenue or 0))
    total_orders = totals.orders or 0
    avg_order_value = total_revenue / total_orders if total_orders > 0 else Decimal(0)

    # Revenue by day
    daily_result = await db.execute(
        select(
            func.date(Order.created_at).label("period"),
            func.sum(Order.total).label("revenue"),
            func.count(Order.id).label("orders"),
        )
        .where(func.date(Order.created_at) >= start_date)
        .where(func.date(Order.created_at) <= end_date)
        .where(Order.payment_status == "paid")
        .group_by(func.date(Order.created_at))
        .order_by(func.date(Order.created_at))
    )
    revenue_by_period = [
        RevenueByPeriod(
            period=str(row.period),
            revenue=Decimal(str(row.revenue or 0)),
            order_count=row.orders or 0,
        )
        for row in daily_result.all()
    ]

    # Fulfillment breakdown
    fulfillment_result = await db.execute(
        select(Order.fulfillment_type, func.count(Order.id))
        .where(func.date(Order.created_at) >= start_date)
        .where(func.date(Order.created_at) <= end_date)
        .group_by(Order.fulfillment_type)
    )
    fulfillment_breakdown = {
        row[0]: row[1] for row in fulfillment_result.all()
    }

    # Top products for period
    top_products = await get_top_products(db, limit=5, days=(end_date - start_date).days)

    return SalesAnalytics(
        total_revenue=total_revenue,
        total_orders=total_orders,
        average_order_value=avg_order_value,
        revenue_by_period=revenue_by_period,
        top_products=top_products,
        fulfillment_breakdown=fulfillment_breakdown,
    )


async def get_recent_orders(
    db: AsyncSession,
    limit: int = 5,
) -> list[dict]:
    """Get most recent orders for dashboard."""
    result = await db.execute(
        select(Order)
        .order_by(Order.created_at.desc())
        .limit(limit)
    )

    orders = []
    for order in result.scalars().all():
        orders.append({
            "id": order.id,
            "order_number": order.order_number,
            "status": order.status,
            "total": str(order.total),
            "item_count": len(order.items),
            "fulfillment_type": order.fulfillment_type,
            "requested_date": str(order.requested_date),
            "created_at": order.created_at.isoformat(),
        })

    return orders
