/**
 * Product detail page - SEO-friendly, shareable product URL
 */

import { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/features/landing";
import {
  useProduct,
  DietaryBadgesFull,
  PriceDisplay,
  SavingsBadge,
  QuantitySelector,
  useCartStore,
} from "@/features/shop";
import { useToastStore } from "@/stores/toast-store";

export function ProductPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading, error } = useProduct(slug || "");
  const { addItem } = useCartStore();
  const { showToast } = useToastStore();

  const handleAddToCart = () => {
    if (!product) return;

    // Add product to cart with quantity
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name,
        price: product.price,
        gradient_from: product.gradient_from,
        gradient_to: product.gradient_to,
        primary_image_url: product.primary_image_url,
      });
    }

    showToast(`Added ${quantity} ${product.name} to cart`, "success");
  };

  const isOnSale =
    product?.compare_at_price && product.compare_at_price > product.price;

  // Gradient colors for effects
  const glowFrom = product?.gradient_from || "#6366F1";
  const glowTo = product?.gradient_to || "#8B5CF6";

  return (
    <div
      className="min-h-screen text-neutral-100 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Grain texture overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-10" />

      {/* Vignette overlay */}
      <div className="fixed inset-0 vignette pointer-events-none z-10" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main content */}
      <main className="relative z-20 pt-24 pb-16 px-4">
        <div className="max-w-6xl mx-auto">
          {/* Back link */}
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors mb-8"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Back to Shop
          </Link>

          {/* Loading state */}
          {isLoading && (
            <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
              <div className="aspect-square rounded-2xl bg-neutral-800/50 animate-pulse" />
              <div className="space-y-4">
                <div className="h-6 w-32 bg-neutral-800/50 rounded animate-pulse" />
                <div className="h-10 w-3/4 bg-neutral-800/50 rounded animate-pulse" />
                <div className="h-24 bg-neutral-800/50 rounded animate-pulse" />
              </div>
            </div>
          )}

          {/* Error state */}
          {error && (
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <svg
                  className="w-8 h-8 text-neutral-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-neutral-300 mb-2">
                Product Not Found
              </h2>
              <p className="text-neutral-500 mb-6">
                The product you're looking for doesn't exist or has been
                removed.
              </p>
              <button
                onClick={() => navigate("/shop")}
                className="inline-flex px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider text-sm rounded-full shadow-lg shadow-primary-500/25 transition-all"
              >
                Browse Products
              </button>
            </div>
          )}

          {/* Product content */}
          {product && (
            <div
              className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-neutral-800/50 overflow-hidden"
              style={{
                boxShadow: `0 0 0 1px ${glowFrom}11, 0 25px 50px -12px ${glowFrom}22`,
              }}
            >
              <div className="grid md:grid-cols-2 gap-0">
                {/* Product image */}
                <div className="relative aspect-square md:aspect-auto md:min-h-[500px]">
                  {product.primary_image_url ? (
                    <img
                      src={product.primary_image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{
                        background: `linear-gradient(135deg, ${glowFrom}, ${glowTo})`,
                      }}
                    >
                      <div className="w-40 h-48 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                        <span className="text-white/60 text-lg font-medium uppercase tracking-wider">
                          Treat
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Sale badge */}
                  {isOnSale && (
                    <div className="absolute top-6 left-6 bg-red-500 text-white text-sm font-bold px-4 py-1.5 rounded-full">
                      SALE
                    </div>
                  )}

                  {/* Out of stock overlay */}
                  {!product.is_in_stock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white text-xl font-semibold">
                        Out of Stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Product details */}
                <div className="p-8 lg:p-12 flex flex-col">
                  {/* Category */}
                  {product.category && (
                    <Link
                      to={`/shop?category=${product.category.slug}`}
                      className="text-sm text-primary-400 uppercase tracking-widest font-medium mb-3 hover:text-primary-300 transition-colors inline-flex items-center gap-1.5"
                    >
                      {product.category.name}
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  )}

                  {/* Name */}
                  <h1 className="font-display text-3xl lg:text-4xl font-semibold tracking-tight text-primary-200 mb-4">
                    {product.name.replace(/\n/g, " ")}
                  </h1>

                  {/* Dietary badges */}
                  <div className="mb-6">
                    <DietaryBadgesFull product={product} />
                  </div>

                  {/* Price */}
                  <div className="flex items-center gap-4 mb-6">
                    <PriceDisplay
                      price={product.price}
                      compareAtPrice={product.compare_at_price}
                      size="lg"
                    />
                    {isOnSale && product.compare_at_price && (
                      <SavingsBadge
                        price={product.price}
                        compareAtPrice={product.compare_at_price}
                      />
                    )}
                  </div>

                  {/* Nutrition facts */}
                  <div className="flex items-center gap-6 mb-6 p-4 bg-neutral-800/40 rounded-xl border border-neutral-700/50">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-300">
                        {product.protein_grams}g
                      </div>
                      <div className="text-xs text-neutral-400 uppercase tracking-wider">
                        Protein
                      </div>
                    </div>
                    {product.calories && (
                      <>
                        <div className="w-px h-10 bg-neutral-700" />
                        <div className="text-center">
                          <div className="text-2xl font-bold text-secondary-300">
                            {product.calories}
                          </div>
                          <div className="text-xs text-neutral-400 uppercase tracking-wider">
                            Calories
                          </div>
                        </div>
                      </>
                    )}
                    {product.is_gluten_free && (
                      <>
                        <div className="w-px h-10 bg-neutral-700" />
                        <div className="flex items-center gap-2 text-sm text-neutral-300">
                          <svg
                            className="w-5 h-5 text-secondary-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                          Gluten Free
                        </div>
                      </>
                    )}
                  </div>

                  {/* Description */}
                  {product.description && (
                    <p className="text-neutral-400 leading-relaxed mb-8">
                      {product.description}
                    </p>
                  )}

                  {/* Spacer */}
                  <div className="flex-1 min-h-4" />

                  {/* Stock warning */}
                  {!product.is_in_stock && (
                    <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">
                      This product is currently out of stock. Check back later!
                    </div>
                  )}

                  {/* Quantity and Add to Cart */}
                  <div className="flex items-center gap-4">
                    <QuantitySelector
                      quantity={quantity}
                      onChange={setQuantity}
                      disabled={!product.is_in_stock}
                    />

                    <button
                      onClick={handleAddToCart}
                      disabled={!product.is_in_stock}
                      className="flex-1 bg-primary-500 hover:bg-primary-400 disabled:bg-neutral-700 disabled:cursor-not-allowed text-neutral-950 disabled:text-neutral-400 font-semibold uppercase tracking-wider py-4 px-8 rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
                    >
                      {product.is_in_stock ? "Add to Cart" : "Out of Stock"}
                    </button>
                  </div>

                  {/* Free shipping note */}
                  <p className="text-xs text-neutral-500 text-center mt-4">
                    Free shipping on orders over $50
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
