/**
 * Shop page - Product catalog
 */

import { useState } from "react";
import { LandingNavbar } from "@/features/landing";
import {
  ProductGrid,
  ProductSort,
  ProductDetailModal,
  CategoryPills,
  CartButton,
  CartDrawer,
  SearchInput,
  DietaryFilterPills,
  useProducts,
  useFilterParams,
  useFilterStore,
  useCartStore,
  type ProductListItem,
} from "@/features/shop";
import { ToastContainer } from "@/components/ui/toast";
import { toastSuccess } from "@/stores/toast-store";

export function ShopPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductListItem | null>(null);

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

  return (
    <div
      className="min-h-screen text-neutral-100 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Grain texture overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-10" />

      {/* Vignette overlay */}
      <div className="fixed inset-0 vignette pointer-events-none z-10" />

      {/* Ambient glow orbs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Left purple glow */}
        <div
          className="absolute top-1/3 left-0 -translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-screen"
          style={{ backgroundColor: "#9B6BFF" }}
        />
        {/* Right gold glow */}
        <div
          className="absolute top-1/2 right-0 translate-x-1/2 w-[500px] h-[500px] rounded-full blur-3xl opacity-30 mix-blend-screen"
          style={{ backgroundColor: "#E1CE71" }}
        />
      </div>

      {/* Navigation */}
      <LandingNavbar />

      {/* Main content */}
      <main className="relative z-20 pt-24 pb-16 px-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            {/* Section title with decorative lines */}
            <div className="flex items-center justify-center gap-4 mb-4">
              <div className="h-px w-12 bg-primary-400/50" />
              <span className="text-sm uppercase tracking-widest text-primary-200 font-semibold">
                Shop
              </span>
              <div className="h-px w-12 bg-primary-400/50" />
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight text-primary-200 mb-4 drop-shadow">
              Our Products
            </h1>
            <p className="text-neutral-200 max-w-2xl mx-auto text-base sm:text-lg">
              Real food protein treats, made fresh with no preservatives.
              Gluten-free, high-protein goodness you can actually feel good about.
            </p>
          </div>

          {/* Category pills */}
          <div className="mb-6">
            <CategoryPills />
          </div>

          {/* Search and dietary filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
            <SearchInput />
            <DietaryFilterPills />
          </div>

          {/* Toolbar */}
          <div className="flex items-center justify-between mb-8 py-3 px-4 bg-neutral-900/40 backdrop-blur-sm rounded-xl border border-neutral-800/50">
            {/* Product count */}
            <div className="text-sm text-neutral-300">
              {data ? (
                <>
                  Showing{" "}
                  <span className="text-primary-300 font-medium">
                    {data.items.length}
                  </span>{" "}
                  of{" "}
                  <span className="text-primary-300 font-medium">
                    {data.total}
                  </span>{" "}
                  products
                </>
              ) : (
                <span className="animate-pulse">Loading...</span>
              )}
            </div>

            {/* Sort and Cart */}
            <div className="flex items-center gap-4">
              <ProductSort />
              <CartButton />
            </div>
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
