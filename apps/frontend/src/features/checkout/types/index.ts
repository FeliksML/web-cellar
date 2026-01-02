/**
 * Checkout feature types
 */

export interface ShippingAddress {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  apartment?: string;
  city: string;
  state: string;
  zipCode: string;
}

// Fulfillment types for bakery orders
export type FulfillmentType = "delivery" | "pickup";

// Time slot options for delivery
export type TimeSlot = "morning" | "afternoon" | "evening";

export const TIME_SLOT_LABELS: Record<TimeSlot, string> = {
  morning: "Morning (9am - 12pm)",
  afternoon: "Afternoon (12pm - 5pm)",
  evening: "Evening (5pm - 8pm)",
};

// Delivery preferences selected during checkout
export interface DeliveryPreferences {
  fulfillmentType: FulfillmentType;
  requestedDate: string; // ISO date string (YYYY-MM-DD)
  timeSlot: TimeSlot | null;
}

// Checkout steps - includes delivery and payment steps
export type CheckoutStep = "cart" | "shipping" | "delivery" | "payment" | "confirmation";

// Legacy types for backward compatibility during transition
export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  gradient_from?: string;
  gradient_to?: string;
}

// Legacy Order type (kept for confirmation display, actual orders use server types)
export interface Order {
  id: string;
  orderNumber: string;
  items: OrderItem[];
  shipping: ShippingAddress;
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: "pending" | "confirmed" | "shipped" | "delivered";
  createdAt: string;
}
