/**
 * Zustand store for product filters
 */

import { create } from "zustand";

interface FilterState {
  // Filters
  category: string | null;
  minPrice: number | null;
  maxPrice: number | null;
  search: string;

  // Sorting
  sortBy: "name" | "price" | "created_at" | "display_order";
  sortOrder: "asc" | "desc";

  // Pagination
  page: number;
  pageSize: number;

  // Actions
  setCategory: (category: string | null) => void;
  setPriceRange: (min: number | null, max: number | null) => void;
  setSearch: (search: string) => void;
  setSortBy: (sortBy: FilterState["sortBy"]) => void;
  setSortOrder: (sortOrder: FilterState["sortOrder"]) => void;
  setPage: (page: number) => void;
  setPageSize: (pageSize: number) => void;
  resetFilters: () => void;
}

const initialState = {
  category: null,
  minPrice: null,
  maxPrice: null,
  search: "",
  sortBy: "display_order" as const,
  sortOrder: "asc" as const,
  page: 1,
  pageSize: 12,
};

export const useFilterStore = create<FilterState>((set) => ({
  ...initialState,

  setCategory: (category) => set({ category, page: 1 }),

  setPriceRange: (minPrice, maxPrice) => set({ minPrice, maxPrice, page: 1 }),

  setSearch: (search) => set({ search, page: 1 }),

  setSortBy: (sortBy) => set({ sortBy, page: 1 }),

  setSortOrder: (sortOrder) => set({ sortOrder }),

  setPage: (page) => set({ page }),

  setPageSize: (pageSize) => set({ pageSize, page: 1 }),

  resetFilters: () => set(initialState),
}));

/**
 * Convert filter store state to API query params
 */
export function useFilterParams() {
  const state = useFilterStore();

  return {
    category: state.category || undefined,
    min_price: state.minPrice || undefined,
    max_price: state.maxPrice || undefined,
    search: state.search || undefined,
    sort_by: state.sortBy,
    sort_order: state.sortOrder,
    page: state.page,
    page_size: state.pageSize,
  };
}
