import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { RootLayout } from "@/components/layout/root-layout";
import { HomePage } from "@/app/routes/home";
import { ShopPage } from "@/app/routes/shop";
import { ProductPage } from "@/app/routes/product";
import { CheckoutPage } from "@/app/routes/checkout";
import { LoginPage } from "@/app/routes/login";
import { RegisterPage } from "@/app/routes/register";
import { NotFoundPage } from "@/app/routes/not-found";

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
]);

export function AppRouter() {
  return <RouterProvider router={router} />;
}
