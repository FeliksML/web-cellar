import { NavLink, Outlet } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth-store";
import "./admin-layout.css";

const navItems = [
    { to: "/admin", label: "Dashboard", icon: "📊", end: true },
    { to: "/admin/orders", label: "Orders", icon: "📦" },
    { to: "/admin/products", label: "Products", icon: "🍪" },
    { to: "/admin/inventory", label: "Inventory", icon: "📋" },
    { to: "/admin/reviews", label: "Reviews", icon: "⭐" },
    { to: "/admin/customers", label: "Customers", icon: "👥" },
    { to: "/admin/analytics", label: "Analytics", icon: "📈" },
    { to: "/admin/promo-codes", label: "Promo Codes", icon: "🎟️" },
    { to: "/admin/settings", label: "Settings", icon: "⚙️" },
];

export function AdminLayout() {
    const { user, logout } = useAuthStore();

    return (
        <div className="admin-layout">
            {/* Sidebar */}
            <aside className="admin-sidebar">
                <div className="admin-sidebar-header">
                    <h1 className="admin-logo">🍪 Beasty Baker</h1>
                    <span className="admin-badge">Admin</span>
                </div>

                <nav className="admin-nav">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={({ isActive }) =>
                                `admin-nav-item ${isActive ? "active" : ""}`
                            }
                        >
                            <span className="admin-nav-icon">{item.icon}</span>
                            <span className="admin-nav-label">{item.label}</span>
                        </NavLink>
                    ))}
                </nav>

                <div className="admin-sidebar-footer">
                    <div className="admin-user-info">
                        <span className="admin-user-email">{user?.email}</span>
                        <span className="admin-user-role">{user?.role}</span>
                    </div>
                    <button
                        onClick={() => {
                            logout();
                            window.location.href = "/login";
                        }}
                        className="admin-logout-btn"
                    >
                        Logout
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="admin-main">
                <Outlet />
            </main>
        </div>
    );
}
