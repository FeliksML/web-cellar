// API hooks for admin analytics
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { AnalyticsData, AnalyticsFilters } from "../types/analytics";

export const analyticsQueryKeys = {
    all: ["admin", "analytics"] as const,
    sales: (filters: AnalyticsFilters) => ["admin", "analytics", "sales", filters] as const,
};

// Fetch sales analytics
async function fetchAnalytics(filters: AnalyticsFilters): Promise<AnalyticsData> {
    const { data } = await apiClient.get(
        `/admin/dashboard/analytics?start_date=${filters.start_date}&end_date=${filters.end_date}`
    );
    return data;
}

export function useAnalytics(filters: AnalyticsFilters) {
    return useQuery({
        queryKey: analyticsQueryKeys.sales(filters),
        queryFn: () => fetchAnalytics(filters),
        staleTime: 5 * 60 * 1000, // 5 minutes
    });
}

// Helper to get date ranges
export function getDateRange(period: "7d" | "30d" | "90d" | "1y"): AnalyticsFilters {
    const end = new Date();
    const start = new Date();

    switch (period) {
        case "7d":
            start.setDate(start.getDate() - 7);
            break;
        case "30d":
            start.setDate(start.getDate() - 30);
            break;
        case "90d":
            start.setDate(start.getDate() - 90);
            break;
        case "1y":
            start.setFullYear(start.getFullYear() - 1);
            break;
    }

    return {
        start_date: start.toISOString().split("T")[0],
        end_date: end.toISOString().split("T")[0],
    };
}
