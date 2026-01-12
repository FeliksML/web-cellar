// API hooks for admin product management
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
    PaginatedProducts,
    ProductFilters,
    Category,
} from "../types/products";

// Query keys
export const productsQueryKeys = {
    all: ["admin", "products"] as const,
    list: (filters: ProductFilters) => ["admin", "products", "list", filters] as const,
    detail: (id: number) => ["admin", "products", "detail", id] as const,
    categories: ["admin", "categories"] as const,
};

// Fetch paginated products
async function fetchProducts(filters: ProductFilters): Promise<PaginatedProducts> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));
    if (filters.search) params.set("search", filters.search);
    if (filters.is_active !== undefined && filters.is_active !== null) {
        params.set("is_active", String(filters.is_active));
    }

    const { data } = await apiClient.get(`/admin/products?${params.toString()}`);
    return data;
}

export function useAdminProducts(filters: ProductFilters = {}) {
    return useQuery({
        queryKey: productsQueryKeys.list(filters),
        queryFn: () => fetchProducts(filters),
        staleTime: 30 * 1000,
    });
}

// Fetch categories
async function fetchCategories(): Promise<Category[]> {
    const { data } = await apiClient.get("/admin/categories");
    return data;
}

export function useAdminCategories() {
    return useQuery({
        queryKey: productsQueryKeys.categories,
        queryFn: fetchCategories,
        staleTime: 5 * 60 * 1000,
    });
}

// Update product
async function updateProduct(
    productId: number,
    data: Record<string, unknown>
): Promise<void> {
    await apiClient.put(`/admin/products/${productId}`, data);
}

export function useUpdateProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, data }: { productId: number; data: Record<string, unknown> }) =>
            updateProduct(productId, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: ["admin", "widgets"] });
        },
    });
}

// Update single stock
async function updateStock(productId: number, quantity: number): Promise<void> {
    await apiClient.put(`/admin/products/${productId}`, {
        stock_quantity: quantity,
    });
}

export function useUpdateStock() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ productId, quantity }: { productId: number; quantity: number }) =>
            updateStock(productId, quantity),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
            queryClient.invalidateQueries({ queryKey: ["admin"] });
        },
    });
}

// Delete product
async function deleteProduct(productId: number): Promise<void> {
    await apiClient.delete(`/admin/products/${productId}`);
}

export function useDeleteProduct() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: productsQueryKeys.all });
        },
    });
}
