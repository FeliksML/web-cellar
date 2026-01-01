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

  // Dietary filters
  isGlutenFree: boolean | undefined;
  isDairyFree: boolean | undefined;
  isVegan: boolean | undefined;
  isKetoFriendly: boolean | undefined;

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
  setGlutenFree: (value: boolean | undefined) => void;
  setDairyFree: (value: boolean | undefined) => void;
  setVegan: (value: boolean | undefined) => void;
  setKetoFriendly: (value: boolean | undefined) => void;
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
  isGlutenFree: undefined,
  isDairyFree: undefined,
  isVegan: undefined,
  isKetoFriendly: undefined,
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

  setGlutenFree: (isGlutenFree) => set({ isGlutenFree, page: 1 }),
  setDairyFree: (isDairyFree) => set({ isDairyFree, page: 1 }),
  setVegan: (isVegan) => set({ isVegan, page: 1 }),
  setKetoFriendly: (isKetoFriendly) => set({ isKetoFriendly, page: 1 }),

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
    is_gluten_free: state.isGlutenFree,
    is_dairy_free: state.isDairyFree,
    is_vegan: state.isVegan,
    is_keto_friendly: state.isKetoFriendly,
    sort_by: state.sortBy,
    sort_order: state.sortOrder,
    page: state.page,
    page_size: state.pageSize,
  };
}
