// Analytics types for admin
export interface AnalyticsData {
    total_revenue: number;
    total_orders: number;
    average_order_value: number;
    revenue_by_period: PeriodData[];
    top_products: TopProductAnalytics[];
    fulfillment_breakdown: Record<string, number>;
}

export interface PeriodData {
    period: string;
    revenue: number;
    order_count: number;
}

export interface TopProductAnalytics {
    product_id: number;
    name: string;
    sku: string;
    quantity_sold: number;
    revenue: number;
    image_url: string | null;
}

export interface CategoryPerformance {
    category_id: number;
    category_name: string;
    product_count: number;
    total_revenue: number;
    order_count: number;
}

export interface AnalyticsFilters {
    start_date: string;
    end_date: string;
}

// Promo code types
export interface PromoCode {
    id: number;
    code: string;
    description: string | null;
    discount_type: "percentage" | "fixed_amount";
    discount_value: number;
    minimum_order_value: number | null;
    maximum_discount: number | null;
    usage_limit: number | null;
    usage_count: number;
    valid_from: string | null;
    valid_until: string | null;
    is_active: boolean;
    created_at: string;
}

export interface PromoCodeCreate {
    code: string;
    description?: string | null;
    discount_type: "percentage" | "fixed_amount";
    discount_value: number;
    minimum_order_value?: number | null;
    maximum_discount?: number | null;
    usage_limit?: number | null;
    valid_from?: string | null;
    valid_until?: string | null;
    is_active?: boolean;
}

export interface PaginatedPromoCodes {
    items: PromoCode[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}
