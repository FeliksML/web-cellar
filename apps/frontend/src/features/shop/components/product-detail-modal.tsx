/**
 * Product detail modal
 */

import { useState, useEffect } from "react";
import { useProduct } from "../api/get-product";
import { DietaryBadgesFull } from "./dietary-badges";
import { PriceDisplay, SavingsBadge } from "./price-display";
import { QuantitySelector } from "./quantity-selector";
import type { ProductListItem } from "../types";

interface ProductDetailModalProps {
  product: ProductListItem | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart?: (productId: number, quantity: number) => void;
}

export function ProductDetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
}: ProductDetailModalProps) {
  const [quantity, setQuantity] = useState(1);
  const [isAnimating, setIsAnimating] = useState(false);

  // Fetch full product details
  const { data: fullProduct, isLoading } = useProduct(product?.slug || "");

  // Reset quantity when product changes
  useEffect(() => {
    setQuantity(1);
  }, [product?.id]);

  // Handle entrance animation
  useEffect(() => {
    if (isOpen) {
      // Small delay to trigger CSS transition
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  const displayProduct = fullProduct || product;
  const isOnSale =
    displayProduct.compare_at_price &&
    displayProduct.compare_at_price > displayProduct.price;

  // Gradient colors for glow effect
  const glowFrom = displayProduct.gradient_from || "#6366F1";
  const glowTo = displayProduct.gradient_to || "#8B5CF6";

  const handleAddToCart = () => {
    onAddToCart?.(displayProduct.id, quantity);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative bg-neutral-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl transition-all duration-300 ${
          isAnimating
            ? "opacity-100 scale-100 translate-y-0"
            : "opacity-0 scale-95 translate-y-4"
        }`}
        style={{
          boxShadow: `0 0 0 1px ${glowFrom}22, 0 25px 50px -12px ${glowFrom}33, 0 0 100px -20px ${glowTo}22`,
        }}
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-neutral-800/80 backdrop-blur-sm border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-700/80 hover:border-neutral-600/50 transition-all duration-200"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <div className="grid md:grid-cols-2 gap-6 p-6 md:p-8">
          {/* Image */}
          <div className="relative aspect-square rounded-xl overflow-hidden">
            {displayProduct.primary_image_url ? (
              <img
                src={displayProduct.primary_image_url}
                alt={displayProduct.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center"
                style={{
                  background: `linear-gradient(135deg, ${displayProduct.gradient_from || "#6366F1"}, ${displayProduct.gradient_to || "#8B5CF6"})`,
                }}
              >
                <div className="w-32 h-36 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <span className="text-white/60 text-sm font-medium uppercase tracking-wider">
                    Treat
                  </span>
                </div>
              </div>
            )}

            {/* Sale badge */}
            {isOnSale && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                SALE
              </div>
            )}
          </div>

          {/* Details */}
          <div className="flex flex-col">
            {/* Category */}
            {displayProduct.category && (
              <span className="text-sm text-primary-400 uppercase tracking-widest font-medium mb-2">
                {displayProduct.category.name}
              </span>
            )}

            {/* Name */}
            <h2 className="font-display text-2xl md:text-3xl font-semibold tracking-tight text-primary-200 mb-4">
              {displayProduct.name.replace(/\n/g, " ")}
            </h2>

            {/* Dietary badges */}
            <div className="mb-4">
              <DietaryBadgesFull product={displayProduct} />
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-4">
              <PriceDisplay
                price={displayProduct.price}
                compareAtPrice={displayProduct.compare_at_price}
                size="lg"
              />
              {isOnSale && displayProduct.compare_at_price && (
                <SavingsBadge
                  price={displayProduct.price}
                  compareAtPrice={displayProduct.compare_at_price}
                />
              )}
            </div>

            {/* Nutrition */}
            {displayProduct.protein_grams && (
              <div className="flex items-center gap-4 mb-4 text-sm text-neutral-400">
                <span className="flex items-center gap-1">
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
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                  {displayProduct.protein_grams}g Protein
                </span>
                {fullProduct?.calories && (
                  <span>{fullProduct.calories} calories</span>
                )}
              </div>
            )}

            {/* Description */}
            {isLoading ? (
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-neutral-800 rounded w-full animate-pulse" />
                <div className="h-4 bg-neutral-800 rounded w-3/4 animate-pulse" />
              </div>
            ) : (
              fullProduct?.description && (
                <p className="text-neutral-400 mb-6 leading-relaxed">
                  {fullProduct.description}
                </p>
              )
            )}

            {/* Spacer */}
            <div className="flex-1" />

            {/* Stock status */}
            {!displayProduct.is_in_stock && (
              <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
                This product is currently out of stock
              </div>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <QuantitySelector
                quantity={quantity}
                onChange={setQuantity}
                disabled={!displayProduct.is_in_stock}
              />

              <button
                onClick={handleAddToCart}
                disabled={!displayProduct.is_in_stock}
                className="flex-1 bg-primary-500 hover:bg-primary-400 disabled:bg-neutral-700 disabled:cursor-not-allowed text-neutral-950 disabled:text-neutral-400 font-semibold uppercase tracking-wider py-3.5 px-6 rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
              >
                {displayProduct.is_in_stock ? "Add to Cart" : "Out of Stock"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
