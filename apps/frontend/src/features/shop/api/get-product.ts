/**
 * API hook for fetching a single product
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Product } from "../types";

async function fetchProduct(slug: string): Promise<Product> {
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
