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

export interface OrderItem {
  productId: number;
  name: string;
  price: number;
  quantity: number;
  gradient_from?: string;
  gradient_to?: string;
}

export type CheckoutStep = "cart" | "shipping" | "confirmation";
