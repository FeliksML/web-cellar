/**
 * Order mutation hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Order, OrderCancelRequest, OrderCreate } from "../types";
import { orderKeys } from "./get-orders";
import { cartKeys } from "@/features/shop/api/cart";
import { getSessionId } from "@/features/shop/utils/session";

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
