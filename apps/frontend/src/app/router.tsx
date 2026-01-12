import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { HomePage } from "@/app/routes/home";
import { ShopPage } from "@/app/routes/shop";
import { ProductPage } from "@/app/routes/product";
import { CheckoutPage } from "@/app/routes/checkout";
import { LoginPage } from "@/app/routes/login";
import { RegisterPage } from "@/app/routes/register";
import { NotFoundPage } from "@/app/routes/not-found";
import { AdminGuard, AdminLayout, AdminDashboard } from "@/features/admin";
import { AdminOrders } from "@/features/admin/pages/admin-orders";
import { AdminProducts } from "@/features/admin/pages/admin-products";
import { AdminInventory } from "@/features/admin/pages/admin-inventory";
import { AdminReviews } from "@/features/admin/pages/admin-reviews";
import { AdminCustomers } from "@/features/admin/pages/admin-customers";
import { AdminSettings } from "@/features/admin/pages/admin-settings";
import { AdminAnalytics } from "@/features/admin/pages/admin-analytics";
import { AdminPromo } from "@/features/admin/pages/admin-promo";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "shop",
        element: <ShopPage />,
      },
      {
        path: "shop/:slug",
        element: <ProductPage />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "login",
        element: <LoginPage />,
      },
      {
        path: "register",
        element: <RegisterPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
  // Admin Routes
  {
    path: "/admin",
    element: (
      <AdminGuard>
        <AdminLayout />
      </AdminGuard>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "orders",
        element: <AdminOrders />,
      },
      {
        path: "products",
        element: <AdminProducts />,
      },
      {
        path: "inventory",
        element: <AdminInventory />,
      },
      {
        path: "reviews",
        element: <AdminReviews />,
      },
      {
        path: "customers",
        element: <AdminCustomers />,
      },
      {
        path: "analytics",
        element: <AdminAnalytics />,
      },
      {
        path: "promo-codes",
        element: <AdminPromo />,
      },
      {
        path: "settings",
        element: <AdminSettings />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
