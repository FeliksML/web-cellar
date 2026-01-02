/**
 * API hook for fetching products
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PaginatedProducts, ProductFilters } from "../types";
import { getMockProducts } from "../data/mock-products";

// Set to true to always use mock data (for development without backend)
const USE_MOCK_DATA = false;

async function fetchProducts(
  filters: ProductFilters = {}
): Promise<PaginatedProducts> {
  // Use mock data if enabled or as fallback
  if (USE_MOCK_DATA) {
    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 300));
    return getMockProducts({
      category: filters.category,
      search: filters.search,
      is_gluten_free: filters.is_gluten_free,
      is_dairy_free: filters.is_dairy_free,
      is_vegan: filters.is_vegan,
      is_keto_friendly: filters.is_keto_friendly,
      sort_by: filters.sort_by,
      sort_order: filters.sort_order,
      page: filters.page,
      page_size: filters.page_size,
    });
  }

  const params = new URLSearchParams();

  if (filters.category) params.append("category", filters.category);
  if (filters.is_featured !== undefined)
    params.append("is_featured", String(filters.is_featured));
  if (filters.is_bestseller !== undefined)
    params.append("is_bestseller", String(filters.is_bestseller));
  if (filters.is_gluten_free !== undefined)
    params.append("is_gluten_free", String(filters.is_gluten_free));
  if (filters.is_dairy_free !== undefined)
    params.append("is_dairy_free", String(filters.is_dairy_free));
  if (filters.is_vegan !== undefined)
    params.append("is_vegan", String(filters.is_vegan));
  if (filters.is_keto_friendly !== undefined)
    params.append("is_keto_friendly", String(filters.is_keto_friendly));
  if (filters.min_price !== undefined)
    params.append("min_price", String(filters.min_price));
  if (filters.max_price !== undefined)
    params.append("max_price", String(filters.max_price));
  if (filters.search) params.append("search", filters.search);
  if (filters.sort_by) params.append("sort_by", filters.sort_by);
  if (filters.sort_order) params.append("sort_order", filters.sort_order);
  if (filters.page) params.append("page", String(filters.page));
  if (filters.page_size) params.append("page_size", String(filters.page_size));

  const response = await apiClient.get<PaginatedProducts>(
    `/products?${params.toString()}`
  );
  return response.data;
}

export function useProducts(filters: ProductFilters = {}) {
  return useQuery({
    queryKey: ["products", "list", filters],
    queryFn: () => fetchProducts(filters),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
