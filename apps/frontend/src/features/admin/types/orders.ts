// Order management types for admin

export interface OrderItemResponse {
    id: number;
    product_id: number;
    product_name: string;
    product_sku: string;
    quantity: number;
    unit_price: number;
    subtotal: number;
    special_instructions: string | null;
    created_at: string;
}

export interface AddressSnapshot {
    first_name: string;
    last_name: string;
    phone: string | null;
    address_line1: string;
    address_line2: string | null;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    delivery_instructions: string | null;
}

export interface OrderResponse {
    id: number;
    order_number: string;
    user_id: number | null;
    status: OrderStatus;
    payment_status: PaymentStatus;
    payment_method: string | null;

    shipping_address_snapshot: AddressSnapshot;
    billing_address_snapshot: AddressSnapshot | null;

    subtotal: number;
    shipping_cost: number;
    tax_amount: number;
    discount_amount: number;
    total: number;

    fulfillment_type: FulfillmentType;
    requested_date: string;
    requested_time_slot: string | null;

    contact_email: string;
    contact_phone: string | null;

    customer_notes: string | null;
    internal_notes?: string | null;

    items: OrderItemResponse[];

    is_cancellable: boolean;
    is_modifiable: boolean;

    confirmed_at: string | null;
    preparing_at: string | null;
    ready_at: string | null;
    completed_at: string | null;
    cancelled_at: string | null;
    cancellation_reason: string | null;
    created_at: string;
    updated_at: string;
}

export interface OrderListItem {
    id: number;
    order_number: string;
    status: OrderStatus;
    payment_status: PaymentStatus;
    fulfillment_type: FulfillmentType;
    requested_date: string;
    total: number;
    item_count: number;
    created_at: string;
}

export interface PaginatedOrders {
    items: OrderListItem[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface OrderFilters {
    status?: OrderStatus | null;
    payment_status?: PaymentStatus | null;
    fulfillment_type?: FulfillmentType | null;
    search?: string | null;
    page?: number;
    page_size?: number;
}

export interface OrderStatusUpdate {
    status: OrderStatus;
    reason?: string | null;
}

export interface OrderNotesUpdate {
    internal_notes: string | null;
}

export type OrderStatus =
    | "pending"
    | "confirmed"
    | "preparing"
    | "ready"
    | "out_for_delivery"
    | "delivered"
    | "picked_up"
    | "cancelled";

export type PaymentStatus = "pending" | "paid" | "refunded" | "failed";

export type FulfillmentType = "delivery" | "pickup";

// Status workflow - valid transitions
export const ORDER_STATUS_TRANSITIONS: Record<OrderStatus, OrderStatus[]> = {
    pending: ["confirmed", "cancelled"],
    confirmed: ["preparing", "cancelled"],
    preparing: ["ready"],
    ready: ["out_for_delivery", "picked_up"],
    out_for_delivery: ["delivered"],
    delivered: [],
    picked_up: [],
    cancelled: [],
};

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
    pending: "Pending",
    confirmed: "Confirmed",
    preparing: "Preparing",
    ready: "Ready",
    out_for_delivery: "Out for Delivery",
    delivered: "Delivered",
    picked_up: "Picked Up",
    cancelled: "Cancelled",
};

export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
    pending: "#fbbf24",
    confirmed: "#3b82f6",
    preparing: "#a855f7",
    ready: "#22c55e",
    out_for_delivery: "#06b6d4",
    delivered: "#10b981",
    picked_up: "#10b981",
    cancelled: "#ef4444",
};
