// API hooks for admin promo codes
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PromoCode, PromoCodeCreate, PaginatedPromoCodes } from "../types/analytics";

interface PromoFilters {
    page?: number;
    page_size?: number;
    is_active?: boolean | null;
    search?: string | null;
}

export const promoQueryKeys = {
    all: ["admin", "promo-codes"] as const,
    list: (filters: PromoFilters) => ["admin", "promo-codes", "list", filters] as const,
};

// Fetch promo codes
async function fetchPromoCodes(filters: PromoFilters): Promise<PaginatedPromoCodes> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));
    if (filters.is_active !== undefined && filters.is_active !== null) {
        params.set("is_active", String(filters.is_active));
    }
    if (filters.search) params.set("search", filters.search);

    const { data } = await apiClient.get(`/admin/promo-codes?${params.toString()}`);
    return data;
}

export function useAdminPromoCodes(filters: PromoFilters = {}) {
    return useQuery({
        queryKey: promoQueryKeys.list(filters),
        queryFn: () => fetchPromoCodes(filters),
        staleTime: 30 * 1000,
    });
}

// Create promo code
async function createPromoCode(data: PromoCodeCreate): Promise<PromoCode> {
    const { data: result } = await apiClient.post("/admin/promo-codes", data);
    return result;
}

export function useCreatePromoCode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: createPromoCode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: promoQueryKeys.all });
        },
    });
}

// Update promo code
async function updatePromoCode(id: number, data: Partial<PromoCodeCreate>): Promise<PromoCode> {
    const { data: result } = await apiClient.put(`/admin/promo-codes/${id}`, data);
    return result;
}

export function useUpdatePromoCode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ id, data }: { id: number; data: Partial<PromoCodeCreate> }) =>
            updatePromoCode(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: promoQueryKeys.all });
        },
    });
}

// Delete promo code
async function deletePromoCode(id: number): Promise<void> {
    await apiClient.delete(`/admin/promo-codes/${id}`);
}

export function useDeletePromoCode() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deletePromoCode,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: promoQueryKeys.all });
        },
    });
}
