import { useState } from "react";
import { useAdminCustomers, useAdminCustomer } from "../api/customers";
import type { CustomerFilters, CustomerListItem } from "../types/reviews-customers";
import "./admin-customers.css";

export function AdminCustomers() {
    const [filters, setFilters] = useState<CustomerFilters>({
        page: 1,
        page_size: 20,
    });
    const [searchInput, setSearchInput] = useState("");
    const [selectedCustomerId, setSelectedCustomerId] = useState<number | null>(null);

    const { data, isLoading, error } = useAdminCustomers(filters);
    const { data: customerDetail, isLoading: detailLoading } = useAdminCustomer(selectedCustomerId);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, search: searchInput || null, page: 1 }));
    };

    const handleFilterChange = (key: keyof CustomerFilters, value: unknown) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleSelectCustomer = (customer: CustomerListItem) => {
        setSelectedCustomerId(customer.id);
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading customers...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load customers</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-customers">
            <header className="admin-page-header">
                <h1>Customers</h1>
                <p className="admin-page-subtitle">
                    View customer information and order history
                </p>
            </header>

            {/* Filters */}
            <div className="customers-filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">Search</button>
                </form>

                <select
                    value={filters.has_orders === null || filters.has_orders === undefined ? "" : String(filters.has_orders)}
                    onChange={(e) => handleFilterChange("has_orders", e.target.value === "" ? null : e.target.value === "true")}
                    className="filter-select"
                >
                    <option value="">All Customers</option>
                    <option value="true">With Orders</option>
                    <option value="false">No Orders</option>
                </select>
            </div>

            {/* Summary */}
            <div className="customers-summary">
                Showing {data?.items.length || 0} of {data?.total || 0} customers
            </div>

            <div className="customers-layout">
                {/* Customers Table */}
                <div className="customers-table-wrapper">
                    <table className="customers-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Orders</th>
                                <th>Total Spent</th>
                                <th>Last Order</th>
                                <th>Joined</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.items.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-row">No customers found</td>
                                </tr>
                            ) : (
                                data?.items.map((customer) => (
                                    <tr
                                        key={customer.id}
                                        onClick={() => handleSelectCustomer(customer)}
                                        className={selectedCustomerId === customer.id ? "selected" : ""}
                                    >
                                        <td className="customer-cell">
                                            <span className="customer-name">
                                                {customer.first_name || customer.last_name
                                                    ? `${customer.first_name || ""} ${customer.last_name || ""}`
                                                    : "—"}
                                            </span>
                                            <span className="customer-email">{customer.email}</span>
                                        </td>
                                        <td className="orders-count">{customer.order_count}</td>
                                        <td className="total-spent">${customer.total_spent}</td>
                                        <td className="last-order">
                                            {customer.last_order_date
                                                ? new Date(customer.last_order_date).toLocaleDateString()
                                                : "Never"}
                                        </td>
                                        <td className="joined-date">
                                            {new Date(customer.created_at).toLocaleDateString()}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Customer Detail Panel */}
                {selectedCustomerId && (
                    <div className="customer-detail-panel">
                        <button className="close-panel" onClick={() => setSelectedCustomerId(null)}>✕</button>

                        {detailLoading ? (
                            <div className="loading-detail">Loading...</div>
                        ) : customerDetail ? (
                            <>
                                <div className="detail-header">
                                    <h3>
                                        {customerDetail.first_name || customerDetail.last_name
                                            ? `${customerDetail.first_name || ""} ${customerDetail.last_name || ""}`
                                            : "Customer"}
                                    </h3>
                                    <span className="detail-email">{customerDetail.email}</span>
                                </div>

                                <div className="detail-stats">
                                    <div className="stat">
                                        <span className="stat-value">{customerDetail.order_count}</span>
                                        <span className="stat-label">Orders</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">${customerDetail.total_spent}</span>
                                        <span className="stat-label">Total Spent</span>
                                    </div>
                                    <div className="stat">
                                        <span className="stat-value">
                                            ${customerDetail.average_order_value || 0}
                                        </span>
                                        <span className="stat-label">Avg Order</span>
                                    </div>
                                </div>

                                <div className="detail-info">
                                    {customerDetail.phone && (
                                        <p><strong>Phone:</strong> {customerDetail.phone}</p>
                                    )}
                                    <p><strong>Member since:</strong> {new Date(customerDetail.created_at).toLocaleDateString()}</p>
                                </div>

                                <div className="recent-orders-section">
                                    <h4>Recent Orders</h4>
                                    {customerDetail.recent_orders.length === 0 ? (
                                        <p className="no-orders">No orders yet</p>
                                    ) : (
                                        <div className="recent-orders-list">
                                            {customerDetail.recent_orders.map((order) => (
                                                <div key={order.id} className="order-item">
                                                    <span className="order-number">{order.order_number}</span>
                                                    <span className={`order-status status-${order.status}`}>{order.status}</span>
                                                    <span className="order-total">${order.total}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : null}
                    </div>
                )}
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
