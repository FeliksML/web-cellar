import { useState } from "react";
import { useAdminOrders, useUpdateOrderStatus } from "../api/orders";
import type { OrderFilters, OrderStatus, OrderListItem } from "../types/orders";
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from "../types/orders";
import "./admin-orders.css";

const STATUS_OPTIONS: OrderStatus[] = [
    "pending",
    "confirmed",
    "preparing",
    "ready",
    "out_for_delivery",
    "delivered",
    "picked_up",
    "cancelled",
];

const PAYMENT_STATUS_OPTIONS = ["pending", "paid", "refunded", "failed"];
const FULFILLMENT_OPTIONS = ["delivery", "pickup"];

export function AdminOrders() {
    const [filters, setFilters] = useState<OrderFilters>({
        page: 1,
        page_size: 20,
    });
    const [searchInput, setSearchInput] = useState("");
    const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

    const { data, isLoading, error } = useAdminOrders(filters);
    const updateStatus = useUpdateOrderStatus();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, search: searchInput || null, page: 1 }));
    };

    const handleFilterChange = (key: keyof OrderFilters, value: string | null) => {
        setFilters((prev) => ({ ...prev, [key]: value || null, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleStatusChange = async (order: OrderListItem, newStatus: OrderStatus) => {
        if (newStatus === "cancelled") {
            const reason = prompt("Please enter a cancellation reason:");
            if (!reason) return;
            await updateStatus.mutateAsync({
                orderNumber: order.order_number,
                statusData: { status: newStatus, reason },
            });
        } else {
            await updateStatus.mutateAsync({
                orderNumber: order.order_number,
                statusData: { status: newStatus },
            });
        }
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load orders</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-orders">
            <header className="admin-page-header">
                <h1>Order Management</h1>
                <p className="admin-page-subtitle">
                    View and manage all customer orders
                </p>
            </header>

            {/* Filters Bar */}
            <div className="orders-filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by order # or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>
                </form>

                <div className="filter-group">
                    <select
                        value={filters.status || ""}
                        onChange={(e) => handleFilterChange("status", e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Statuses</option>
                        {STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {ORDER_STATUS_LABELS[status]}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.payment_status || ""}
                        onChange={(e) => handleFilterChange("payment_status", e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Payments</option>
                        {PAYMENT_STATUS_OPTIONS.map((status) => (
                            <option key={status} value={status}>
                                {status.charAt(0).toUpperCase() + status.slice(1)}
                            </option>
                        ))}
                    </select>

                    <select
                        value={filters.fulfillment_type || ""}
                        onChange={(e) => handleFilterChange("fulfillment_type", e.target.value)}
                        className="filter-select"
                    >
                        <option value="">All Types</option>
                        {FULFILLMENT_OPTIONS.map((type) => (
                            <option key={type} value={type}>
                                {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                        ))}
                    </select>

                    {(filters.status || filters.payment_status || filters.fulfillment_type || filters.search) && (
                        <button
                            onClick={() => {
                                setFilters({ page: 1, page_size: 20 });
                                setSearchInput("");
                            }}
                            className="clear-filters-btn"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="orders-summary">
                <span>
                    Showing {data?.items.length || 0} of {data?.total || 0} orders
                </span>
            </div>

            {/* Orders Table */}
            <div className="orders-table-wrapper">
                <table className="orders-table">
                    <thead>
                        <tr>
                            <th>Order #</th>
                            <th>Status</th>
                            <th>Payment</th>
                            <th>Type</th>
                            <th>Date</th>
                            <th>Items</th>
                            <th>Total</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="empty-row">
                                    No orders found
                                </td>
                            </tr>
                        ) : (
                            data?.items.map((order) => (
                                <tr
                                    key={order.id}
                                    className={selectedOrder === order.order_number ? "selected" : ""}
                                    onClick={() => setSelectedOrder(order.order_number)}
                                >
                                    <td className="order-number">{order.order_number}</td>
                                    <td>
                                        <span
                                            className="status-badge"
                                            style={{
                                                backgroundColor: `${ORDER_STATUS_COLORS[order.status]}20`,
                                                color: ORDER_STATUS_COLORS[order.status],
                                                borderColor: `${ORDER_STATUS_COLORS[order.status]}40`,
                                            }}
                                        >
                                            {ORDER_STATUS_LABELS[order.status]}
                                        </span>
                                    </td>
                                    <td>
                                        <span className={`payment-badge payment-${order.payment_status}`}>
                                            {order.payment_status}
                                        </span>
                                    </td>
                                    <td className="fulfillment-type">
                                        {order.fulfillment_type === "delivery" ? "🚚" : "🏪"}{" "}
                                        {order.fulfillment_type}
                                    </td>
                                    <td className="order-date">{order.requested_date}</td>
                                    <td className="item-count">{order.item_count}</td>
                                    <td className="order-total">${order.total}</td>
                                    <td className="actions-cell" onClick={(e) => e.stopPropagation()}>
                                        <select
                                            value=""
                                            onChange={(e) => {
                                                if (e.target.value) {
                                                    handleStatusChange(order, e.target.value as OrderStatus);
                                                }
                                            }}
                                            className="status-action-select"
                                            disabled={updateStatus.isPending}
                                        >
                                            <option value="">Update Status</option>
                                            {getNextStatuses(order.status).map((status) => (
                                                <option key={status} value={status}>
                                                    → {ORDER_STATUS_LABELS[status]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {data && data.total_pages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(data.page - 1)}
                        disabled={data.page <= 1}
                        className="page-btn"
                    >
                        ← Previous
                    </button>
                    <span className="page-info">
                        Page {data.page} of {data.total_pages}
                    </span>
                    <button
                        onClick={() => handlePageChange(data.page + 1)}
                        disabled={data.page >= data.total_pages}
                        className="page-btn"
                    >
                        Next →
                    </button>
                </div>
            )}
        </div>
    );
}

// Helper function to get valid next statuses
function getNextStatuses(currentStatus: OrderStatus): OrderStatus[] {
    const transitions: Record<OrderStatus, OrderStatus[]> = {
        pending: ["confirmed", "cancelled"],
        confirmed: ["preparing", "cancelled"],
        preparing: ["ready"],
        ready: ["out_for_delivery", "picked_up"],
        out_for_delivery: ["delivered"],
        delivered: [],
        picked_up: [],
        cancelled: [],
    };
    return transitions[currentStatus] || [];
}
