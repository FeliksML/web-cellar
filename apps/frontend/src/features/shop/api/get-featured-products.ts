/**
 * API hook for fetching featured products
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { ProductListItem } from "../types";
import { MOCK_PRODUCTS } from "../data/mock-products";

// Set to true to always use mock data (for development without backend)
const USE_MOCK_DATA = true;

async function fetchFeaturedProducts(
  limit: number = 4
): Promise<ProductListItem[]> {
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.filter((p) => p.is_featured).slice(0, limit);
  }

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
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_PRODUCTS.filter((p) => p.is_bestseller).slice(0, limit);
  }

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
