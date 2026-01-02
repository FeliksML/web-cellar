/**
 * API hooks for fetching orders
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Order, OrderFilters, PaginatedOrders } from "../types";

export const orderKeys = {
  all: ["orders"] as const,
  lists: () => [...orderKeys.all, "list"] as const,
  list: (filters: OrderFilters) => [...orderKeys.lists(), filters] as const,
  details: () => [...orderKeys.all, "detail"] as const,
  detail: (orderNumber: string) =>
    [...orderKeys.details(), orderNumber] as const,
};

async function fetchOrders(filters: OrderFilters = {}): Promise<PaginatedOrders> {
  const params = new URLSearchParams();
  if (filters.page) params.append("page", String(filters.page));
  if (filters.page_size) params.append("page_size", String(filters.page_size));

  const url = params.toString() ? `/orders?${params.toString()}` : "/orders";
  const response = await apiClient.get<PaginatedOrders>(url);
  return response.data;
}

export function useOrders(filters: OrderFilters = {}) {
  return useQuery({
    queryKey: orderKeys.list(filters),
    queryFn: () => fetchOrders(filters),
    staleTime: 60 * 1000, // 1 minute
  });
}

async function fetchOrder(orderNumber: string): Promise<Order> {
  const response = await apiClient.get<Order>(`/orders/${orderNumber}`);
  return response.data;
}

export function useOrder(orderNumber: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderNumber),
    queryFn: () => fetchOrder(orderNumber),
    enabled: !!orderNumber,
    staleTime: 60 * 1000,
  });
}
