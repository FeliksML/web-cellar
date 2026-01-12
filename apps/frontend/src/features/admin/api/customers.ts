// API hooks for admin customers management
import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { PaginatedCustomers, CustomerFilters, CustomerDetail } from "../types/reviews-customers";

export const customersQueryKeys = {
    all: ["admin", "customers"] as const,
    list: (filters: CustomerFilters) => ["admin", "customers", "list", filters] as const,
    detail: (id: number) => ["admin", "customers", "detail", id] as const,
};

// Fetch customers
async function fetchCustomers(filters: CustomerFilters): Promise<PaginatedCustomers> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));
    if (filters.search) params.set("search", filters.search);
    if (filters.has_orders !== undefined && filters.has_orders !== null) {
        params.set("has_orders", String(filters.has_orders));
    }

    const { data } = await apiClient.get(`/admin/customers?${params.toString()}`);
    return data;
}

export function useAdminCustomers(filters: CustomerFilters = {}) {
    return useQuery({
        queryKey: customersQueryKeys.list(filters),
        queryFn: () => fetchCustomers(filters),
        staleTime: 30 * 1000,
    });
}

// Fetch customer detail
async function fetchCustomer(customerId: number): Promise<CustomerDetail> {
    const { data } = await apiClient.get(`/admin/customers/${customerId}`);
    return data;
}

export function useAdminCustomer(customerId: number | null) {
    return useQuery({
        queryKey: customersQueryKeys.detail(customerId!),
        queryFn: () => fetchCustomer(customerId!),
        enabled: customerId !== null,
    });
}
