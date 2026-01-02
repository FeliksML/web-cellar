/**
 * Product card component for the shop
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductListItem } from "../types";
import { DietaryBadges } from "./dietary-badges";
import { PriceDisplay } from "./price-display";

interface ShopProductCardProps {
  product: ProductListItem;
  onQuickView?: (product: ProductListItem) => void;
  onAddToCart?: (product: ProductListItem) => void;
}

export function ShopProductCard({
  product,
  onQuickView,
  onAddToCart,
}: ShopProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isAdding) return;

    setIsAdding(true);
    onAddToCart?.(product);

    // Reset after animation
    setTimeout(() => {
      setIsAdding(false);
    }, 1500);
  };

  // Dynamic glow color based on product gradient
  const glowColor = product.gradient_from || "#6366F1";

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="group block text-center transition-all duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-2xl"
    >
      {/* Product image with glow effect */}
      <div
        className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden transition-shadow duration-300"
        style={{
          boxShadow: `0 8px 32px -8px ${glowColor}33`,
        }}
      >
        {/* Hover glow intensification */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
          style={{
            boxShadow: `0 16px 48px -8px ${glowColor}66, 0 0 0 1px ${glowColor}22`,
          }}
        />

        {product.primary_image_url ? (
          <img
            src={product.primary_image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{
              background: `linear-gradient(135deg, ${product.gradient_from || "#6366F1"}, ${product.gradient_to || "#8B5CF6"})`,
            }}
          >
            <div className="w-24 h-28 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
              <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                Treat
              </span>
            </div>
          </div>
        )}

        {/* Sale badge */}
        {product.is_on_sale && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            SALE
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold">Out of Stock</span>
          </div>
        )}

        {/* Action buttons - show on hover */}
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-200">
          {/* Quick View button */}
          {onQuickView && (
            <button
              onClick={handleQuickView}
              className="p-2.5 rounded-full bg-neutral-800/90 border border-neutral-700/50 text-neutral-300 hover:text-white hover:border-neutral-600/50 transition-all shadow-lg"
              aria-label="Quick view"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
            </button>
          )}

          {/* Add to Cart button */}
          {product.is_in_stock && onAddToCart && (
            <button
              onClick={handleAddToCart}
              disabled={isAdding}
              className={`
                font-semibold text-sm px-4 py-2 rounded-full transition-all duration-200 shadow-lg
                transform ${isAdding ? "scale-105" : "hover:scale-105"}
                ${isAdding
                  ? "bg-secondary-500 text-white"
                  : "bg-primary-500 hover:bg-primary-600 text-neutral-950"
                }
              `}
            >
              {isAdding ? (
                <span className="flex items-center gap-1.5">
                  <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                  Added!
                </span>
              ) : (
                "Add to Cart"
              )}
            </button>
          )}
        </div>
      </div>

      {/* Product info */}
      <div className="mt-4 space-y-2">
        {/* Name */}
        <h3 className="text-lg font-semibold text-primary-200 group-hover:text-primary-300 line-clamp-2">
          {product.name.replace(/\n/g, " ")}
        </h3>

        {/* Dietary badges */}
        <DietaryBadges product={product} size="sm" />

        {/* Price */}
        <PriceDisplay
          price={product.price}
          compareAtPrice={product.compare_at_price}
        />

        {/* Protein info */}
        {product.protein_grams && (
          <p className="text-xs text-neutral-400">
            {product.protein_grams}g Protein
          </p>
        )}
      </div>
    </Link>
  );
}
