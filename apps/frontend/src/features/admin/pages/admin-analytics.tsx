import { useState, useMemo } from "react";
import { useAnalytics, getDateRange } from "../api/analytics";
import type { AnalyticsFilters } from "../types/analytics";
import "./admin-analytics.css";

type Period = "7d" | "30d" | "90d" | "1y";

export function AdminAnalytics() {
    const [period, setPeriod] = useState<Period>("30d");
    const filters: AnalyticsFilters = useMemo(() => getDateRange(period), [period]);

    const { data, isLoading, error } = useAnalytics(filters);

    // Calculate max values for chart scaling
    const maxRevenue = useMemo(() => {
        if (!data?.revenue_by_period.length) return 0;
        return Math.max(...data.revenue_by_period.map((p) => p.revenue));
    }, [data?.revenue_by_period]);

    const maxOrders = useMemo(() => {
        if (!data?.revenue_by_period.length) return 0;
        return Math.max(...data.revenue_by_period.map((p) => p.order_count));
    }, [data?.revenue_by_period]);

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading analytics...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load analytics</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-analytics">
            <header className="admin-page-header">
                <div className="header-content">
                    <div>
                        <h1>📊 Sales Analytics</h1>
                        <p className="admin-page-subtitle">
                            Track your bakery's performance over time
                        </p>
                    </div>
                    <div className="period-selector">
                        {(["7d", "30d", "90d", "1y"] as Period[]).map((p) => (
                            <button
                                key={p}
                                onClick={() => setPeriod(p)}
                                className={`period-btn ${period === p ? "active" : ""}`}
                            >
                                {p === "7d" ? "7 Days" : p === "30d" ? "30 Days" : p === "90d" ? "90 Days" : "1 Year"}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* Key Metrics */}
            <div className="metrics-grid">
                <div className="metric-card revenue">
                    <span className="metric-label">Total Revenue</span>
                    <span className="metric-value">{formatCurrency(data?.total_revenue || 0)}</span>
                </div>
                <div className="metric-card orders">
                    <span className="metric-label">Total Orders</span>
                    <span className="metric-value">{data?.total_orders || 0}</span>
                </div>
                <div className="metric-card avg">
                    <span className="metric-label">Avg Order Value</span>
                    <span className="metric-value">{formatCurrency(data?.average_order_value || 0)}</span>
                </div>
            </div>

            {/* Revenue Chart */}
            <section className="chart-section">
                <h2>Revenue Trend</h2>
                <div className="bar-chart">
                    {data?.revenue_by_period.map((point, index) => (
                        <div key={index} className="chart-bar-wrapper">
                            <div
                                className="chart-bar revenue-bar"
                                style={{ height: `${(point.revenue / (maxRevenue || 1)) * 100}%` }}
                                title={`${formatDate(point.period)}: ${formatCurrency(point.revenue)}`}
                            />
                            <span className="chart-label">{formatDateShort(point.period)}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* Orders Chart */}
            <section className="chart-section">
                <h2>Order Volume</h2>
                <div className="bar-chart">
                    {data?.revenue_by_period.map((point, index) => (
                        <div key={index} className="chart-bar-wrapper">
                            <div
                                className="chart-bar orders-bar"
                                style={{ height: `${(point.order_count / (maxOrders || 1)) * 100}%` }}
                                title={`${formatDate(point.period)}: ${point.order_count} orders`}
                            />
                            <span className="chart-label">{formatDateShort(point.period)}</span>
                        </div>
                    ))}
                </div>
            </section>

            <div className="analytics-grid">
                {/* Top Products */}
                <section className="analytics-card">
                    <h2>🏆 Top Products</h2>
                    <div className="top-products-list">
                        {data?.top_products.length === 0 ? (
                            <p className="empty-state">No sales data</p>
                        ) : (
                            data?.top_products.map((product, index) => (
                                <div key={product.product_id} className="product-row">
                                    <span className="rank">#{index + 1}</span>
                                    {product.image_url && (
                                        <img src={product.image_url} alt={product.name} className="product-img" />
                                    )}
                                    <div className="product-info">
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-sold">{product.quantity_sold} sold</span>
                                    </div>
                                    <span className="product-revenue">{formatCurrency(product.revenue)}</span>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Fulfillment Breakdown */}
                <section className="analytics-card">
                    <h2>📦 Fulfillment Types</h2>
                    <div className="fulfillment-chart">
                        {data?.fulfillment_breakdown && Object.entries(data.fulfillment_breakdown).length > 0 ? (
                            Object.entries(data.fulfillment_breakdown).map(([type, count]) => {
                                const total = Object.values(data.fulfillment_breakdown).reduce((a, b) => a + b, 0);
                                const percentage = total > 0 ? (count / total) * 100 : 0;
                                return (
                                    <div key={type} className="fulfillment-row">
                                        <span className="fulfillment-icon">
                                            {type === "delivery" ? "🚚" : "🏪"}
                                        </span>
                                        <span className="fulfillment-type">{type}</span>
                                        <div className="fulfillment-bar-container">
                                            <div
                                                className={`fulfillment-bar ${type}`}
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                        <span className="fulfillment-count">{count}</span>
                                        <span className="fulfillment-percent">({percentage.toFixed(0)}%)</span>
                                    </div>
                                );
                            })
                        ) : (
                            <p className="empty-state">No data</p>
                        )}
                    </div>
                </section>
            </div>

            {/* Data Table */}
            <section className="data-table-section">
                <h2>Daily Breakdown</h2>
                <div className="data-table-wrapper">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Orders</th>
                                <th>Revenue</th>
                                <th>Avg Order</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data?.revenue_by_period.slice().reverse().slice(0, 14).map((point) => (
                                <tr key={point.period}>
                                    <td>{formatDate(point.period)}</td>
                                    <td>{point.order_count}</td>
                                    <td className="revenue-cell">{formatCurrency(point.revenue)}</td>
                                    <td>
                                        {point.order_count > 0
                                            ? formatCurrency(point.revenue / point.order_count)
                                            : "-"}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    );
}

// Helpers
function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function formatDateShort(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "numeric", day: "numeric" });
}
