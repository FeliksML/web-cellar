/**
 * Shop page - Product catalog
 */

import { useState } from "react";
import { LandingNavbar, BottomTabBar } from "@/features/landing";
import {
  ProductGrid,
  ProductSort,
  ProductDetailModal,
  CategoryPills,
  CartButton,
  CartDrawer,
  SearchInput,
  DietaryFilterPills,
  MobileShopView,
  useProducts,
  useFilterParams,
  useFilterStore,
  useCartStore,
  type ProductListItem,
} from "@/features/shop";
import { ToastContainer } from "@/components/ui/toast";
import { toastSuccess } from "@/stores/toast-store";
import { useIsMobile } from "@/hooks/use-media-query";

export function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);
  const isMobile = useIsMobile();

  const filterParams = useFilterParams();
  const { page, setPage } = useFilterStore();
  const addToCart = useCartStore((state) => state.addItem);

  const { data, isLoading, error } = useProducts(filterParams);

  const handleQuickView = (product: ProductListItem) => {
    setSelectedProduct(product);
  };

  const handleAddToCart = (product: ProductListItem) => {
    addToCart(product, 1);
    toastSuccess(`${product.name} added to cart!`);
  };

  const handleModalAddToCart = (productId: number, quantity: number) => {
    // Find the product from our current data or the selected product
    const product = data?.items.find((p) => p.id === productId) || selectedProduct;
    if (product) {
      addToCart(product, quantity);
      toastSuccess(`${quantity}x ${product.name} added to cart!`);
    }
  };

  // Mobile view
  if (isMobile) {
    return (
      <div className="min-h-screen shop-mobile-bg">
        <LandingNavbar />
        <MobileShopView
          products={data?.items || []}
          isLoading={isLoading}
          onAddToCart={handleAddToCart}
        />
        <BottomTabBar />
        <CartDrawer />
        <ToastContainer />
      </div>
    );
  }

  // Desktop view
  return (
    <div className="min-h-screen text-neutral-100 shop-mobile-bg">
      {/* Navigation */}
      <LandingNavbar />

      {/* Main content */}
      <main className="relative z-20 pt-8 pb-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Minimal header - same style as mobile */}
          <div className="text-center mb-8">
            <span
              className="font-medium uppercase"
              style={{
                fontSize: "14px",
                letterSpacing: "0.32em",
                color: "#73747A",
              }}
            >
              SHOP
            </span>
          </div>

          {/* Filters row - horizontal on desktop */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <CategoryPills />
            <div className="flex items-center gap-3">
              <SearchInput />
              <ProductSort />
              <CartButton />
            </div>
          </div>

          {/* Dietary filters */}
          <div className="mb-8">
            <DietaryFilterPills />
          </div>

          {/* Product grid */}
          {error ? (
            <div className="text-center py-16">
              <p className="text-red-400">Failed to load products</p>
              <p className="text-neutral-500 text-sm mt-2">
                Please try again later
              </p>
            </div>
          ) : (
            <>
              <ProductGrid
                products={data?.items || []}
                isLoading={isLoading}
                onQuickView={handleQuickView}
                onAddToCart={handleAddToCart}
              />

              {/* Pagination */}
              {data && data.total_pages > 1 && (
                <div className="flex justify-center items-center gap-3 mt-12">
                  <button
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1}
                    className="px-5 py-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full border border-neutral-700/50 text-neutral-200 hover:bg-neutral-700/60 hover:border-neutral-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </span>
                  </button>

                  <div className="flex items-center gap-1.5">
                    {Array.from({ length: data.total_pages }, (_, i) => i + 1)
                      .filter(
                        (p) =>
                          p === 1 ||
                          p === data.total_pages ||
                          Math.abs(p - page) <= 1
                      )
                      .map((p, i, arr) => {
                        // Add ellipsis
                        const prev = arr[i - 1];
                        const showEllipsis = prev && p - prev > 1;

                        return (
                          <span key={p} className="flex items-center">
                            {showEllipsis && (
                              <span className="px-2 text-neutral-500">
                                ...
                              </span>
                            )}
                            <button
                              onClick={() => setPage(p)}
                              className={`w-10 h-10 rounded-full transition-all duration-200 ${
                                p === page
                                  ? "bg-primary-500 text-neutral-950 font-semibold shadow-lg shadow-primary-500/25"
                                  : "bg-neutral-800/60 backdrop-blur-sm border border-neutral-700/50 text-neutral-200 hover:bg-neutral-700/60 hover:border-neutral-600/50"
                              }`}
                            >
                              {p}
                            </button>
                          </span>
                        );
                      })}
                  </div>

                  <button
                    onClick={() => setPage(page + 1)}
                    disabled={page >= data.total_pages}
                    className="px-5 py-2.5 bg-neutral-800/60 backdrop-blur-sm rounded-full border border-neutral-700/50 text-neutral-200 hover:bg-neutral-700/60 hover:border-neutral-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
                  >
                    <span className="flex items-center gap-1.5">
                      Next
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* Product detail modal */}
      <ProductDetailModal
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={handleModalAddToCart}
      />

      {/* Cart drawer */}
      <CartDrawer />

      {/* Toast notifications */}
      <ToastContainer />
    </div>
  );
}
