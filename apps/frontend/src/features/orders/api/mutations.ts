/**
 * Order mutation hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Order, OrderCancelRequest, OrderCreate } from "../types";
import { orderKeys } from "./get-orders";
import { cartKeys } from "@/features/shop/api/cart";
import { getSessionId } from "@/features/shop/utils/session";

// Set to true to always use mock data (for development without backend)
const USE_MOCK_DATA = true;

// Counter for generating mock order numbers
let mockOrderCounter = 1000;

/**
 * Generate a mock order number
 */
function generateMockOrderNumber(): string {
  mockOrderCounter++;
  const date = new Date();
  const dateStr = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  return `BB-${dateStr}-${mockOrderCounter}`;
}

/**
 * Get headers for order creation (includes session ID for guest checkout)
 */
function getOrderHeaders(): Record<string, string> {
  const sessionId = getSessionId();
  return sessionId ? { "X-Session-ID": sessionId } : {};
}

/**
 * Create a new order from the cart
 */
async function createOrder(data: OrderCreate): Promise<Order> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 500));

    const now = new Date().toISOString();
    const orderNumber = generateMockOrderNumber();

    // Create mock order response
    const mockOrder: Order = {
      id: mockOrderCounter,
      order_number: orderNumber,
      user_id: null,
      status: "confirmed",
      payment_status: "paid",
      payment_method: data.payment_method || "card",

      // Address snapshots
      shipping_address_snapshot: data.shipping_address || {
        first_name: "Guest",
        last_name: "Customer",
        phone: data.contact_phone || null,
        address_line1: "123 Test Street",
        address_line2: null,
        city: "San Francisco",
        state: "CA",
        postal_code: "94102",
        country: "US",
        delivery_instructions: null,
      },
      billing_address_snapshot: null,

      // Pricing (mock values)
      subtotal: 45.99,
      shipping_cost: 5.99,
      tax_amount: 4.14,
      discount_amount: 0,
      total: 56.12,

      // Fulfillment
      fulfillment_type: data.fulfillment_type || "delivery",
      requested_date: data.requested_date,
      requested_time_slot: data.requested_time_slot || null,

      // Contact
      contact_email: data.contact_email,
      contact_phone: data.contact_phone || null,

      // Notes
      customer_notes: data.customer_notes || null,

      // Mock items
      items: [
        {
          id: 1,
          product_id: 1,
          product_name: "Chocolate Fudge Cake",
          product_sku: "CAKE-001",
          quantity: 1,
          unit_price: 45.99,
          subtotal: 45.99,
          special_instructions: null,
          created_at: now,
        },
      ],

      // Status flags
      is_cancellable: true,
      is_modifiable: true,

      // Timestamps
      confirmed_at: now,
      preparing_at: null,
      ready_at: null,
      completed_at: null,
      cancelled_at: null,
      cancellation_reason: null,
      created_at: now,
      updated_at: now,
    };

    return mockOrder;
  }

  const response = await apiClient.post<Order>("/orders", data, {
    headers: getOrderHeaders(),
  });
  return response.data;
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createOrder,
    onSuccess: () => {
      // Invalidate orders list
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      // Invalidate cart (should be empty after order)
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Cancel an order
 */
async function cancelOrder(
  orderNumber: string,
  data: OrderCancelRequest
): Promise<Order> {
  const response = await apiClient.post<Order>(
    `/orders/${orderNumber}/cancel`,
    data
  );
  return response.data;
}

export function useCancelOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      orderNumber,
      data,
    }: {
      orderNumber: string;
      data: OrderCancelRequest;
    }) => cancelOrder(orderNumber, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: orderKeys.all });
      queryClient.invalidateQueries({
        queryKey: orderKeys.detail(variables.orderNumber),
      });
    },
  });
}
