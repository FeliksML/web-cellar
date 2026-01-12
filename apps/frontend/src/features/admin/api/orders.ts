// API hooks for admin order management
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type {
    OrderResponse,
    PaginatedOrders,
    OrderFilters,
    OrderStatusUpdate,
    OrderNotesUpdate,
} from "../types/orders";

// Query keys
export const ordersQueryKeys = {
    all: ["admin", "orders"] as const,
    list: (filters: OrderFilters) => ["admin", "orders", "list", filters] as const,
    detail: (orderNumber: string) => ["admin", "orders", "detail", orderNumber] as const,
};

// Fetch paginated orders
async function fetchOrders(filters: OrderFilters): Promise<PaginatedOrders> {
    const params = new URLSearchParams();
    if (filters.page) params.set("page", String(filters.page));
    if (filters.page_size) params.set("page_size", String(filters.page_size));
    if (filters.status) params.set("status", filters.status);
    if (filters.payment_status) params.set("payment_status", filters.payment_status);
    if (filters.fulfillment_type) params.set("fulfillment_type", filters.fulfillment_type);
    if (filters.search) params.set("search", filters.search);

    const { data } = await apiClient.get(`/admin/orders?${params.toString()}`);
    return data;
}

export function useAdminOrders(filters: OrderFilters = {}) {
    return useQuery({
        queryKey: ordersQueryKeys.list(filters),
        queryFn: () => fetchOrders(filters),
        staleTime: 30 * 1000, // 30 seconds
    });
}

// Fetch single order
async function fetchOrder(orderNumber: string): Promise<OrderResponse> {
    const { data } = await apiClient.get(`/admin/orders/${orderNumber}`);
    return data;
}

export function useAdminOrder(orderNumber: string) {
    return useQuery({
        queryKey: ordersQueryKeys.detail(orderNumber),
        queryFn: () => fetchOrder(orderNumber),
        enabled: !!orderNumber,
    });
}

// Update order status
async function updateOrderStatus(
    orderNumber: string,
    statusData: OrderStatusUpdate
): Promise<OrderResponse> {
    const { data } = await apiClient.put(
        `/admin/orders/${orderNumber}/status`,
        statusData
    );
    return data;
}

export function useUpdateOrderStatus() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderNumber,
            statusData,
        }: {
            orderNumber: string;
            statusData: OrderStatusUpdate;
        }) => updateOrderStatus(orderNumber, statusData),
        onSuccess: (_, { orderNumber }) => {
            queryClient.invalidateQueries({ queryKey: ordersQueryKeys.all });
            queryClient.invalidateQueries({
                queryKey: ordersQueryKeys.detail(orderNumber),
            });
            queryClient.invalidateQueries({ queryKey: ["admin", "widgets"] });
        },
    });
}

// Update order notes
async function updateOrderNotes(
    orderNumber: string,
    notesData: OrderNotesUpdate
): Promise<OrderResponse> {
    const { data } = await apiClient.put(
        `/admin/orders/${orderNumber}/notes`,
        notesData
    );
    return data;
}

export function useUpdateOrderNotes() {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({
            orderNumber,
            notesData,
        }: {
            orderNumber: string;
            notesData: OrderNotesUpdate;
        }) => updateOrderNotes(orderNumber, notesData),
        onSuccess: (_, { orderNumber }) => {
            queryClient.invalidateQueries({
                queryKey: ordersQueryKeys.detail(orderNumber),
            });
        },
    });
}
