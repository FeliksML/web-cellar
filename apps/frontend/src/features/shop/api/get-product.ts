/**
 * API hook for fetching a single product
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Product } from "../types";
import { getMockProductBySlug } from "../data/mock-products";

// Set to true to always use mock data (for development without backend)
const USE_MOCK_DATA = false;

async function fetchProduct(slug: string): Promise<Product> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const product = getMockProductBySlug(slug);
    if (!product) {
      throw new Error("Product not found");
    }
    return product;
  }

  const response = await apiClient.get<Product>(`/products/${slug}`);
  return response.data;
}

export function useProduct(slug: string) {
  return useQuery({
    queryKey: ["products", "detail", slug],
    queryFn: () => fetchProduct(slug),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
