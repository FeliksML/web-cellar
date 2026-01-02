/**
 * Cart API hooks for server-side cart operations
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
  CartDeliveryUpdate,
  CartItemCreate,
  CartItemUpdate,
  CartMergeRequest,
  ServerCart,
  ServerCartItem,
} from "../types";
import { getSessionId } from "../utils/session";

// Query key factory for cart-related queries
export const cartKeys = {
  all: ["cart"] as const,
  detail: () => [...cartKeys.all, "detail"] as const,
};

/**
 * Get headers for cart API requests
 * Includes session ID for guest carts
 */
function getCartHeaders(): Record<string, string> {
  const sessionId = getSessionId();
  return sessionId ? { "X-Session-ID": sessionId } : {};
}

/**
 * Fetch the current cart
 */
async function fetchCart(): Promise<ServerCart> {
  const response = await apiClient.get<ServerCart>("/cart", {
    headers: getCartHeaders(),
  });
  return response.data;
}

/**
 * Add an item to the cart
 */
async function addToCart(data: CartItemCreate): Promise<ServerCartItem> {
  const response = await apiClient.post<ServerCartItem>("/cart/items", data, {
    headers: getCartHeaders(),
  });
  return response.data;
}

/**
 * Update a cart item
 */
async function updateCartItem(
  itemId: number,
  data: CartItemUpdate
): Promise<ServerCartItem> {
  const response = await apiClient.put<ServerCartItem>(
    `/cart/items/${itemId}`,
    data,
    { headers: getCartHeaders() }
  );
  return response.data;
}

/**
 * Remove a cart item
 */
async function removeCartItem(itemId: number): Promise<void> {
  await apiClient.delete(`/cart/items/${itemId}`, {
    headers: getCartHeaders(),
  });
}

/**
 * Clear the entire cart
 */
async function clearCart(): Promise<void> {
  await apiClient.delete("/cart", {
    headers: getCartHeaders(),
  });
}

/**
 * Update cart delivery preferences
 */
async function updateCartDelivery(
  data: CartDeliveryUpdate
): Promise<ServerCart> {
  const response = await apiClient.put<ServerCart>("/cart/delivery", data, {
    headers: getCartHeaders(),
  });
  return response.data;
}

/**
 * Merge a guest cart into the authenticated user's cart
 */
async function mergeCart(data: CartMergeRequest): Promise<ServerCart> {
  const response = await apiClient.post<ServerCart>("/cart/merge", data);
  return response.data;
}

// ============================================================================
// React Query Hooks
// ============================================================================

/**
 * Hook to fetch the current cart
 */
export function useCart(options?: { enabled?: boolean }) {
  return useQuery({
    queryKey: cartKeys.detail(),
    queryFn: fetchCart,
    staleTime: 30 * 1000, // 30 seconds
    enabled: options?.enabled,
  });
}

/**
 * Hook to add an item to the cart
 */
export function useAddToCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addToCart,
    onSuccess: () => {
      // Invalidate cart query to refetch with new item
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to update a cart item
 */
export function useUpdateCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      itemId,
      data,
    }: {
      itemId: number;
      data: CartItemUpdate;
    }) => updateCartItem(itemId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to remove a cart item
 */
export function useRemoveCartItem() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to clear the entire cart
 */
export function useClearCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to update cart delivery preferences
 */
export function useUpdateCartDelivery() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateCartDelivery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}

/**
 * Hook to merge a guest cart into the user's cart
 * Called after login to preserve guest cart items
 */
export function useMergeCart() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: mergeCart,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: cartKeys.all });
    },
  });
}
