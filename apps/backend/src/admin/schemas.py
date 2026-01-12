"""Admin dashboard schemas."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel


class OrderStatusCount(BaseModel):
    """Count of orders by status."""

    status: str
    count: int


class DashboardStats(BaseModel):
    """Dashboard overview statistics."""

    # Today's orders
    orders_today: int
    orders_today_by_status: list[OrderStatusCount]

    # Revenue
    revenue_today: Decimal
    revenue_this_week: Decimal
    revenue_this_month: Decimal
    revenue_growth_percent: float | None  # vs previous period

    # Inventory alerts
    low_stock_count: int
    out_of_stock_count: int

    # Pending items
    pending_reviews_count: int
    pending_orders_count: int


class RevenueByPeriod(BaseModel):
    """Revenue data for a time period."""

    period: str  # Date string or period label
    revenue: Decimal
    order_count: int


class TopProduct(BaseModel):
    """Top selling product data."""

    product_id: int
    name: str
    sku: str
    quantity_sold: int
    revenue: Decimal
    image_url: str | None


class LowStockProduct(BaseModel):
    """Product with low stock alert."""

    id: int
    name: str
    sku: str
    stock_quantity: int
    low_stock_threshold: int
    image_url: str | None


class DashboardWidgets(BaseModel):
    """Complete dashboard data including widgets."""

    stats: DashboardStats
    top_products: list[TopProduct]
    low_stock_products: list[LowStockProduct]
    recent_orders: list[dict]  # Simplified order data


class DateRangeFilter(BaseModel):
    """Date range for analytics queries."""

    start_date: date
    end_date: date


class SalesAnalytics(BaseModel):
    """Sales analytics response."""

    total_revenue: Decimal
    total_orders: int
    average_order_value: Decimal
    revenue_by_period: list[RevenueByPeriod]
    top_products: list[TopProduct]
    fulfillment_breakdown: dict[str, int]  # delivery vs pickup counts


class BulkStockUpdate(BaseModel):
    """Request to update stock for multiple products."""

    updates: list[dict]  # List of {product_id, new_quantity}


class BulkStockUpdateItem(BaseModel):
    """Single item in a bulk stock update."""

    product_id: int
    new_quantity: int


class BulkOrderStatusUpdate(BaseModel):
    """Request to update status for multiple orders."""

    order_ids: list[int]
    new_status: str
    internal_notes: str | None = None
