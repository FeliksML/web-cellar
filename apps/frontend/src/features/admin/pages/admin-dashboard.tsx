import { useDashboardWidgets } from "../api/dashboard";
import "./admin-dashboard.css";

export function AdminDashboard() {
    const { data, isLoading, error } = useDashboardWidgets();

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading dashboard...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load dashboard</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    const { stats, top_products, low_stock_products, recent_orders } = data!;

    return (
        <div className="admin-dashboard">
            <header className="admin-page-header">
                <h1>Dashboard</h1>
                <p className="admin-page-subtitle">
                    Welcome back! Here's what's happening with your bakery today.
                </p>
            </header>

            {/* Stats Grid */}
            <div className="stats-grid">
                <StatCard
                    title="Orders Today"
                    value={stats.orders_today}
                    icon="📦"
                    color="blue"
                    subtitle={
                        stats.pending_orders_count > 0
                            ? `${stats.pending_orders_count} pending`
                            : "All caught up!"
                    }
                />
                <StatCard
                    title="Revenue Today"
                    value={formatCurrency(stats.revenue_today)}
                    icon="💰"
                    color="green"
                    subtitle={`Week: ${formatCurrency(stats.revenue_this_week)}`}
                />
                <StatCard
                    title="Monthly Revenue"
                    value={formatCurrency(stats.revenue_this_month)}
                    icon="📈"
                    color="purple"
                    subtitle={
                        stats.revenue_growth_percent !== null
                            ? `${stats.revenue_growth_percent > 0 ? "+" : ""}${stats.revenue_growth_percent.toFixed(1)}% vs last month`
                            : "First month!"
                    }
                />
                <StatCard
                    title="Inventory Alerts"
                    value={stats.low_stock_count + stats.out_of_stock_count}
                    icon="⚠️"
                    color={stats.out_of_stock_count > 0 ? "red" : "yellow"}
                    subtitle={
                        stats.out_of_stock_count > 0
                            ? `${stats.out_of_stock_count} out of stock!`
                            : `${stats.low_stock_count} low stock`
                    }
                />
            </div>

            {/* Orders by Status */}
            {stats.orders_today_by_status.length > 0 && (
                <div className="status-pills">
                    {stats.orders_today_by_status.map((item) => (
                        <div
                            key={item.status}
                            className={`status-pill status-${item.status}`}
                        >
                            <span className="status-count">{item.count}</span>
                            <span className="status-label">{formatStatus(item.status)}</span>
                        </div>
                    ))}
                </div>
            )}

            <div className="dashboard-grid">
                {/* Recent Orders */}
                <section className="dashboard-card">
                    <div className="card-header">
                        <h2>Recent Orders</h2>
                        <a href="/admin/orders" className="card-link">
                            View all →
                        </a>
                    </div>
                    <div className="orders-list">
                        {recent_orders.length === 0 ? (
                            <p className="empty-state">No orders yet today</p>
                        ) : (
                            recent_orders.map((order) => (
                                <div key={order.id} className="order-row">
                                    <div className="order-info">
                                        <span className="order-number">{order.order_number}</span>
                                        <span className={`order-status status-${order.status}`}>
                                            {formatStatus(order.status)}
                                        </span>
                                    </div>
                                    <div className="order-details">
                                        <span className="order-items">
                                            {order.item_count} item{order.item_count !== 1 ? "s" : ""}
                                        </span>
                                        <span className="order-total">${order.total}</span>
                                    </div>
                                    <div className="order-meta">
                                        <span className="order-type">
                                            {order.fulfillment_type === "delivery" ? "🚚" : "🏪"}{" "}
                                            {order.fulfillment_type}
                                        </span>
                                        <span className="order-date">{order.requested_date}</span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Top Products */}
                <section className="dashboard-card">
                    <div className="card-header">
                        <h2>Top Sellers</h2>
                        <span className="card-badge">Last 30 days</span>
                    </div>
                    <div className="products-list">
                        {top_products.length === 0 ? (
                            <p className="empty-state">No sales data yet</p>
                        ) : (
                            top_products.map((product, index) => (
                                <div key={product.product_id} className="product-row">
                                    <span className="product-rank">#{index + 1}</span>
                                    {product.image_url && (
                                        <img
                                            src={product.image_url}
                                            alt={product.name}
                                            className="product-thumb"
                                        />
                                    )}
                                    <div className="product-info">
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-sku">{product.sku}</span>
                                    </div>
                                    <div className="product-stats">
                                        <span className="product-sold">
                                            {product.quantity_sold} sold
                                        </span>
                                        <span className="product-revenue">
                                            {formatCurrency(product.revenue)}
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                {/* Low Stock Products */}
                <section className="dashboard-card alert-card">
                    <div className="card-header">
                        <h2>⚠️ Low Stock Alerts</h2>
                        <a href="/admin/inventory" className="card-link">
                            Manage →
                        </a>
                    </div>
                    <div className="products-list">
                        {low_stock_products.length === 0 ? (
                            <p className="empty-state success">All products well stocked!</p>
                        ) : (
                            low_stock_products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`product-row ${product.stock_quantity === 0 ? "out-of-stock" : ""}`}
                                >
                                    <div className="product-info">
                                        <span className="product-name">{product.name}</span>
                                        <span className="product-sku">{product.sku}</span>
                                    </div>
                                    <div className="stock-info">
                                        <span
                                            className={`stock-qty ${product.stock_quantity === 0 ? "critical" : "warning"}`}
                                        >
                                            {product.stock_quantity === 0
                                                ? "OUT OF STOCK"
                                                : `${product.stock_quantity} left`}
                                        </span>
                                        <span className="stock-threshold">
                                            (min: {product.low_stock_threshold})
                                        </span>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>
            </div>
        </div>
    );
}

// Helper components
interface StatCardProps {
    title: string;
    value: string | number;
    icon: string;
    color: "blue" | "green" | "purple" | "yellow" | "red";
    subtitle?: string;
}

function StatCard({ title, value, icon, color, subtitle }: StatCardProps) {
    return (
        <div className={`stat-card stat-${color}`}>
            <div className="stat-icon">{icon}</div>
            <div className="stat-content">
                <span className="stat-value">{value}</span>
                <span className="stat-title">{title}</span>
                {subtitle && <span className="stat-subtitle">{subtitle}</span>}
            </div>
        </div>
    );
}

// Helper functions
function formatCurrency(value: number): string {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

function formatStatus(status: string): string {
    return status
        .split("_")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
}
