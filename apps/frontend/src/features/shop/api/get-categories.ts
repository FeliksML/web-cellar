/**
 * API hook for fetching categories
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Category } from "../types";
import { MOCK_CATEGORIES } from "../data/mock-categories";

// Set to true to always use mock data (for development without backend)
const USE_MOCK_DATA = false;

async function fetchCategories(): Promise<Category[]> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    // Simulate network delay for realistic UX
    await new Promise((resolve) => setTimeout(resolve, 200));
    return MOCK_CATEGORIES;
  }

  const response = await apiClient.get<Category[]>("/categories");
  return response.data;
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: fetchCategories,
    staleTime: 10 * 60 * 1000, // 10 minutes (categories don't change often)
  });
}
