// API hooks for admin dashboard
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
    DashboardStats,
    DashboardWidgets,
    SalesAnalytics,
    LowStockProduct,
    TopProduct,
    BulkStockUpdate,
    BulkStockUpdateResponse,
} from "../types";

// Query keys for cache management
export const adminQueryKeys = {
    dashboard: ["admin", "dashboard"] as const,
    stats: ["admin", "stats"] as const,
    widgets: ["admin", "widgets"] as const,
    analytics: (startDate?: string, endDate?: string) =>
        ["admin", "analytics", { startDate, endDate }] as const,
    lowStock: (limit?: number) => ["admin", "low-stock", { limit }] as const,
    topProducts: (limit?: number, days?: number) =>
        ["admin", "top-products", { limit, days }] as const,
};

// Fetch dashboard stats
async function fetchDashboardStats(): Promise<DashboardStats> {
    const { data } = await apiClient.get("/admin/dashboard/stats");
    return data;
}

export function useDashboardStats() {
    return useQuery({
        queryKey: adminQueryKeys.stats,
        queryFn: fetchDashboardStats,
        staleTime: 60 * 1000, // 1 minute
    });
}

// Fetch all dashboard widgets in one call
async function fetchDashboardWidgets(): Promise<DashboardWidgets> {
    const { data } = await apiClient.get("/admin/dashboard/widgets");
    return data;
}

export function useDashboardWidgets() {
    return useQuery({
        queryKey: adminQueryKeys.widgets,
        queryFn: fetchDashboardWidgets,
        staleTime: 60 * 1000, // 1 minute
    });
}

// Fetch sales analytics
interface AnalyticsParams {
    startDate?: string;
    endDate?: string;
}

async function fetchSalesAnalytics(
    params: AnalyticsParams
): Promise<SalesAnalytics> {
    const { data } = await apiClient.get("/admin/dashboard/analytics", {
        params: {
            start_date: params.startDate,
            end_date: params.endDate,
        },
    });
    return data;
}

export function useSalesAnalytics(params: AnalyticsParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.analytics(params.startDate, params.endDate),
        queryFn: () => fetchSalesAnalytics(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Fetch low stock products
async function fetchLowStockProducts(
    limit: number = 20
): Promise<LowStockProduct[]> {
    const { data } = await apiClient.get("/admin/dashboard/low-stock", {
        params: { limit },
    });
    return data;
}

export function useLowStockProducts(limit: number = 20) {
    return useQuery({
        queryKey: adminQueryKeys.lowStock(limit),
        queryFn: () => fetchLowStockProducts(limit),
        staleTime: 60 * 1000, // 1 minute
    });
}

// Fetch top products
interface TopProductsParams {
    limit?: number;
    days?: number;
}

async function fetchTopProducts(
    params: TopProductsParams = {}
): Promise<TopProduct[]> {
    const { data } = await apiClient.get("/admin/dashboard/top-products", {
        params,
    });
    return data;
}

export function useTopProducts(params: TopProductsParams = {}) {
    return useQuery({
        queryKey: adminQueryKeys.topProducts(params.limit, params.days),
        queryFn: () => fetchTopProducts(params),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Bulk update stock mutation
async function bulkUpdateStock(
    data: BulkStockUpdate
): Promise<BulkStockUpdateResponse> {
    const { data: response } = await apiClient.post(
        "/admin/dashboard/inventory/bulk-update",
        data
    );
    return response;
}

export function useBulkUpdateStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: bulkUpdateStock,
        onSuccess: () => {
            // Invalidate related queries
            queryClient.invalidateQueries({ queryKey: ["admin"] });
            queryClient.invalidateQueries({ queryKey: ["products"] });
        },
    });
}
