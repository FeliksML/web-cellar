import { type ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "@/features/auth/stores/auth-store";

interface AdminGuardProps {
    children: ReactNode;
    requireSuperAdmin?: boolean;
}

/**
 * AdminGuard - Protects routes that require admin or super_admin role
 * Redirects to login if not authenticated, or home if not authorized
 */
export function AdminGuard({
    children,
    requireSuperAdmin = false,
}: AdminGuardProps) {
    const location = useLocation();
    const { isAuthenticated, user } = useAuthStore();

    // Not logged in - redirect to login
    if (!isAuthenticated) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has required role
    const isAdmin = user?.role === "admin" || user?.role === "super_admin";
    const isSuperAdmin = user?.role === "super_admin";

    // Requires super admin but user is only admin
    if (requireSuperAdmin && !isSuperAdmin) {
        return <Navigate to="/admin" replace />;
    }

    // Not an admin at all
    if (!isAdmin) {
        return <Navigate to="/" replace />;
    }

    return <>{children}</>;
}
