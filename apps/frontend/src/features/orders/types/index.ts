/**
 * Orders feature types
 */

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "picked_up"
  | "cancelled";

export type PaymentStatus = "pending" | "paid" | "failed" | "refunded";

export type FulfillmentType = "delivery" | "pickup";

export type TimeSlot = "morning" | "afternoon" | "evening";

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

export interface OrderItem {
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

export interface Order {
  id: number;
  order_number: string;
  user_id: number | null;
  status: OrderStatus;
  payment_status: PaymentStatus;
  payment_method: string | null;

  // Addresses
  shipping_address_snapshot: AddressSnapshot;
  billing_address_snapshot: AddressSnapshot | null;

  // Pricing
  subtotal: number;
  shipping_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;

  // Fulfillment
  fulfillment_type: FulfillmentType;
  requested_date: string;
  requested_time_slot: string | null;

  // Contact
  contact_email: string;
  contact_phone: string | null;

  // Notes
  customer_notes: string | null;

  // Items
  items: OrderItem[];

  // Status flags
  is_cancellable: boolean;
  is_modifiable: boolean;

  // Timestamps
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

export interface OrderCreate {
  // Address
  shipping_address_id?: number;
  shipping_address?: AddressSnapshot;
  billing_address_id?: number;
  billing_same_as_shipping?: boolean;

  // Fulfillment
  fulfillment_type?: FulfillmentType;
  requested_date: string;
  requested_time_slot?: TimeSlot;

  // Contact
  contact_email: string;
  contact_phone?: string;

  // Notes
  customer_notes?: string;

  // Payment
  payment_method?: string;
  stripe_payment_intent_id?: string;
}

export interface OrderCancelRequest {
  reason?: string;
}

export interface OrderFilters {
  page?: number;
  page_size?: number;
}
