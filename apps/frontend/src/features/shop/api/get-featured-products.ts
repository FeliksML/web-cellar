/**
 * API hook for fetching featured products
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ProductListItem } from "../types";

async function fetchFeaturedProducts(
  limit: number = 4
): Promise<ProductListItem[]> {
  const response = await apiClient.get<ProductListItem[]>(
    `/products/featured?limit=${limit}`
  );
  return response.data;
}

export function useFeaturedProducts(limit: number = 4) {
  return useQuery({
    queryKey: ["products", "featured", limit],
    queryFn: () => fetchFeaturedProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

async function fetchBestsellerProducts(
  limit: number = 4
): Promise<ProductListItem[]> {
  const response = await apiClient.get<ProductListItem[]>(
    `/products/bestsellers?limit=${limit}`
  );
  return response.data;
}

export function useBestsellerProducts(limit: number = 4) {
  return useQuery({
    queryKey: ["products", "bestsellers", limit],
    queryFn: () => fetchBestsellerProducts(limit),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
