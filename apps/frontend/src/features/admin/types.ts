// Admin dashboard TypeScript types

export interface OrderStatusCount {
    status: string;
    count: number;
}

export interface DashboardStats {
    orders_today: number;
    orders_today_by_status: OrderStatusCount[];
    revenue_today: number;
    revenue_this_week: number;
    revenue_this_month: number;
    revenue_growth_percent: number | null;
    low_stock_count: number;
    out_of_stock_count: number;
    pending_reviews_count: number;
    pending_orders_count: number;
}

export interface TopProduct {
    product_id: number;
    name: string;
    sku: string;
    quantity_sold: number;
    revenue: number;
    image_url: string | null;
}

export interface LowStockProduct {
    id: number;
    name: string;
    sku: string;
    stock_quantity: number;
    low_stock_threshold: number;
    image_url: string | null;
}

export interface RecentOrder {
    id: number;
    order_number: string;
    status: string;
    total: string;
    item_count: number;
    fulfillment_type: string;
    requested_date: string;
    created_at: string;
}

export interface DashboardWidgets {
    stats: DashboardStats;
    top_products: TopProduct[];
    low_stock_products: LowStockProduct[];
    recent_orders: RecentOrder[];
}

export interface RevenueByPeriod {
    period: string;
    revenue: number;
    order_count: number;
}

export interface SalesAnalytics {
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
    revenue_by_period: RevenueByPeriod[];
    top_products: TopProduct[];
    fulfillment_breakdown: Record<string, number>;
}

export interface BulkStockUpdateItem {
    product_id: number;
    new_quantity: number;
}

export interface BulkStockUpdate {
    updates: BulkStockUpdateItem[];
}

export interface BulkStockUpdateResponse {
    updated_count: number;
    errors: string[];
}
