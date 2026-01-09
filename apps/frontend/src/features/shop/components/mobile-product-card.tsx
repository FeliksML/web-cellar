/**
 * Mobile product card component - spec compliant
 * Matches the UI spec for mobile shop section
 */

import { useState } from "react";
import { Link } from "react-router-dom";
import type { ProductListItem } from "../types";

interface MobileProductCardProps {
  product: ProductListItem;
  onAddToCart: (product: ProductListItem) => void;
}

export function MobileProductCard({ product, onAddToCart }: MobileProductCardProps) {
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isAdding || !product.is_in_stock) return;

    setIsAdding(true);
    onAddToCart(product);

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    setTimeout(() => setIsAdding(false), 1500);
  };

  // Format protein/dietary info as subtitle
  const subtitle = product.protein_grams
    ? `${product.protein_grams}g Protein${product.is_gluten_free ? " \u2022 Gluten-Free" : ""}`
    : product.short_description || `$${product.price.toFixed(2)}`;

  return (
    <Link
      to={`/shop/${product.slug}`}
      className="flex flex-col items-center p-4 rounded-[18px] shop-card w-full transition-transform active:scale-[0.98]"
      style={{ height: "210px" }}
    >
      {/* Product Image - 78px height */}
      <div className="h-[78px] w-full flex items-center justify-center mt-1">
        {product.primary_image_url ? (
          <img
            src={product.primary_image_url}
            alt={product.name}
            className="h-full w-auto object-contain"
            loading="lazy"
          />
        ) : (
          // Neutral placeholder - no gradient
          <div
            className="h-16 w-16 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <svg
              className="w-8 h-8 opacity-30"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "#D5D6DA" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
          </div>
        )}
      </div>

      {/* Title - Playfair Display 22px */}
      <h3
        className="font-display font-semibold text-center line-clamp-1 mt-3"
        style={{
          fontSize: "22px",
          lineHeight: "1.05",
          color: "#C89B4F",
        }}
      >
        {product.name.split("\n")[0]}
      </h3>

      {/* Subtitle */}
      <p
        className="text-center line-clamp-1 mt-1.5"
        style={{
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: "1.2",
          color: "#D5D6DA",
        }}
      >
        {subtitle}
      </p>

      {/* CTA Button */}
      <button
        onClick={handleAddToCart}
        disabled={!product.is_in_stock || isAdding}
        className="mt-auto w-full h-[40px] rounded-[12px] font-extrabold uppercase transition-all duration-200 flex items-center justify-center gap-1.5"
        style={{
          fontSize: "14px",
          letterSpacing: "0.08em",
          backgroundColor: isAdding ? "#39C78B" : "#D6A952",
          color: "#1D1205",
          transform: isAdding ? "scale(1.02)" : "scale(1)",
          opacity: product.is_in_stock ? 1 : 0.5,
        }}
      >
        {!product.is_in_stock ? (
          "OUT OF STOCK"
        ) : isAdding ? (
          <>
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={3}
                d="M5 13l4 4L19 7"
              />
            </svg>
            ADDED
          </>
        ) : (
          "ADD TO CART"
        )}
      </button>
    </Link>
  );
}
