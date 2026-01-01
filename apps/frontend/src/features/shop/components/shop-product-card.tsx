/**
 * Product card component for the shop
 */

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
  const handleClick = () => {
    onQuickView?.(product);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  // Dynamic glow color based on product gradient
  const glowColor = product.gradient_from || "#6366F1";

  return (
    <div
      className="group cursor-pointer text-center transition-all duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-2xl"
      onClick={handleClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          handleClick();
        }
      }}
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

        {/* Quick add button - shows on hover */}
        {product.is_in_stock && onAddToCart && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-primary-500 hover:bg-primary-600 text-neutral-950 font-semibold text-sm px-4 py-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg"
          >
            Add to Cart
          </button>
        )}
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
    </div>
  );
}
