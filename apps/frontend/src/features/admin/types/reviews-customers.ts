// Review types for admin
export interface ReviewListItem {
    id: number;
    product_id: number;
    product_name: string;
    user_id: number;
    user_email: string;
    rating: number;
    title: string | null;
    content: string | null;
    is_verified_purchase: boolean;
    is_approved: boolean;
    is_featured: boolean;
    helpful_count: number;
    response: string | null;
    response_at: string | null;
    created_at: string;
}

export interface PaginatedReviews {
    items: ReviewListItem[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface ReviewFilters {
    page?: number;
    page_size?: number;
    is_approved?: boolean | null;
    is_featured?: boolean | null;
    has_response?: boolean | null;
    min_rating?: number | null;
    max_rating?: number | null;
}

// Customer types for admin
export interface CustomerListItem {
    id: number;
    email: string;
    first_name: string | null;
    last_name: string | null;
    phone: string | null;
    role: string;
    is_active: boolean;
    order_count: number;
    total_spent: number;
    last_order_date: string | null;
    created_at: string;
}

export interface PaginatedCustomers {
    items: CustomerListItem[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface CustomerFilters {
    page?: number;
    page_size?: number;
    search?: string | null;
    has_orders?: boolean | null;
}

export interface CustomerDetail extends CustomerListItem {
    average_order_value: number | null;
    recent_orders: {
        id: number;
        order_number: string;
        status: string;
        payment_status: string;
        total: string;
        item_count: number;
        created_at: string;
    }[];
}
