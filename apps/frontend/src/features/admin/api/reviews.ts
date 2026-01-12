// API hooks for admin reviews management
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PaginatedReviews, ReviewFilters, ReviewListItem } from "../types/reviews-customers";

export const reviewsQueryKeys = {
    all: ["admin", "reviews"] as const,
    list: (filters: ReviewFilters) => ["admin", "reviews", "list", filters] as const,
};

// Fetch reviews
async function fetchReviews(filters: ReviewFilters): Promise<PaginatedReviews> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));
    if (filters.is_approved !== undefined && filters.is_approved !== null) {
        params.set("is_approved", String(filters.is_approved));
    }
    if (filters.is_featured !== undefined && filters.is_featured !== null) {
        params.set("is_featured", String(filters.is_featured));
    }
    if (filters.has_response !== undefined && filters.has_response !== null) {
        params.set("has_response", String(filters.has_response));
    }
    if (filters.min_rating) params.set("min_rating", String(filters.min_rating));
    if (filters.max_rating) params.set("max_rating", String(filters.max_rating));

    const { data } = await apiClient.get(`/admin/reviews?${params.toString()}`);
    return data;
}

export function useAdminReviews(filters: ReviewFilters = {}) {
    return useQuery({
        queryKey: reviewsQueryKeys.list(filters),
        queryFn: () => fetchReviews(filters),
        staleTime: 30 * 1000,
    });
}

// Update approval
async function updateApproval(reviewId: number, is_approved: boolean): Promise<ReviewListItem> {
    const { data } = await apiClient.put(`/admin/reviews/${reviewId}/approval`, { is_approved });
    return data;
}

export function useUpdateReviewApproval() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ reviewId, is_approved }: { reviewId: number; is_approved: boolean }) =>
            updateApproval(reviewId, is_approved),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.all });
        },
    });
}

// Update featured
async function updateFeatured(reviewId: number, is_featured: boolean): Promise<ReviewListItem> {
    const { data } = await apiClient.put(`/admin/reviews/${reviewId}/featured`, { is_featured });
    return data;
}

export function useUpdateReviewFeatured() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ reviewId, is_featured }: { reviewId: number; is_featured: boolean }) =>
            updateFeatured(reviewId, is_featured),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.all });
        },
    });
}

// Add response
async function addResponse(reviewId: number, response: string): Promise<ReviewListItem> {
    const { data } = await apiClient.post(`/admin/reviews/${reviewId}/response`, { response });
    return data;
}

export function useAddReviewResponse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: ({ reviewId, response }: { reviewId: number; response: string }) =>
            addResponse(reviewId, response),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.all });
        },
    });
}

// Delete response
async function deleteResponse(reviewId: number): Promise<ReviewListItem> {
    const { data } = await apiClient.delete(`/admin/reviews/${reviewId}/response`);
    return data;
}

export function useDeleteReviewResponse() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: deleteResponse,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: reviewsQueryKeys.all });
        },
    });
}
