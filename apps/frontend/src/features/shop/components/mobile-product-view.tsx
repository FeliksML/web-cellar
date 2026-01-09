/**
 * Mobile product detail view - cohesive with shop design system
 * Uses vignette background, gold accents, bottom tab bar spacing
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useProduct } from "../api/get-product";
import type { Product } from "../types";

interface MobileProductViewProps {
  slug: string;
  onAddToCart: (product: Product, quantity: number) => void;
}

export function MobileProductView({ slug, onAddToCart }: MobileProductViewProps) {
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);

  const { data: product, isLoading, error } = useProduct(slug);

  const handleAddToCart = () => {
    if (!product || isAdding || !product.is_in_stock) return;

    setIsAdding(true);

    // Haptic feedback on mobile
    if (navigator.vibrate) {
      navigator.vibrate(50);
    }

    onAddToCart(product, quantity);

    setTimeout(() => setIsAdding(false), 1500);
  };

  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen pb-[120px]">
        {/* Back button skeleton */}
        <div className="px-5 pt-4">
          <div className="w-24 h-6 rounded bg-neutral-800/50 animate-pulse" />
        </div>

        {/* Image skeleton */}
        <div className="w-full h-[280px] bg-neutral-800/50 animate-pulse mt-4" />

        {/* Content skeleton */}
        <div className="px-5 pt-6 space-y-4">
          <div className="w-20 h-4 rounded bg-neutral-800/50 animate-pulse" />
          <div className="w-3/4 h-8 rounded bg-neutral-800/50 animate-pulse" />
          <div className="w-1/2 h-5 rounded bg-neutral-800/50 animate-pulse" />
          <div className="w-24 h-8 rounded bg-neutral-800/50 animate-pulse" />
          <div className="space-y-2 mt-6">
            <div className="w-full h-4 rounded bg-neutral-800/50 animate-pulse" />
            <div className="w-full h-4 rounded bg-neutral-800/50 animate-pulse" />
            <div className="w-2/3 h-4 rounded bg-neutral-800/50 animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !product) {
    return (
      <div className="min-h-screen pb-[120px] flex flex-col items-center justify-center px-5">
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
          style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: "#73747A" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>
        <h2
          className="text-lg font-semibold mb-2"
          style={{ color: "#D5D6DA" }}
        >
          Product Not Found
        </h2>
        <p
          className="text-sm text-center mb-6"
          style={{ color: "#73747A" }}
        >
          The product you're looking for doesn't exist or has been removed.
        </p>
        <button
          onClick={() => navigate("/shop")}
          className="px-6 py-3 rounded-full font-bold uppercase text-sm"
          style={{
            backgroundColor: "#D6A952",
            color: "#1D1205",
            letterSpacing: "0.08em",
          }}
        >
          Back to Shop
        </button>
      </div>
    );
  }

  // Format subtitle
  const subtitle = product.protein_grams
    ? `${product.protein_grams}g Protein${product.is_gluten_free ? " • Gluten-Free" : ""}`
    : product.short_description || "";

  const isOnSale = product.compare_at_price && product.compare_at_price > product.price;

  return (
    <div className="min-h-screen pb-[120px]">
      {/* Back button */}
      <div className="px-5 pt-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 transition-colors"
          style={{ color: "#73747A" }}
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
          <span className="text-sm font-medium">Back to Shop</span>
        </Link>
      </div>

      {/* Product Image - full width, 280px height */}
      <div className="relative w-full h-[280px] mt-4 overflow-hidden">
        {product.primary_image_url ? (
          <img
            src={product.primary_image_url}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <svg
              className="w-20 h-20 opacity-30"
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

        {/* Sale badge */}
        {isOnSale && (
          <div
            className="absolute top-4 left-5 px-3 py-1 rounded-full text-xs font-bold uppercase"
            style={{ backgroundColor: "#E53E3E", color: "#FFFFFF" }}
          >
            Sale
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.is_in_stock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white text-lg font-semibold">Out of Stock</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="px-5 pt-6">
        {/* Category */}
        {product.category && (
          <Link
            to={`/shop?category=${product.category.slug}`}
            className="uppercase font-medium"
            style={{
              fontSize: "12px",
              letterSpacing: "0.2em",
              color: "#73747A",
            }}
          >
            {product.category.name}
          </Link>
        )}

        {/* Title */}
        <h1
          className="font-display font-semibold mt-2"
          style={{
            fontSize: "28px",
            lineHeight: "1.1",
            color: "#C89B4F",
          }}
        >
          {product.name.replace(/\n/g, " ")}
        </h1>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="mt-2"
            style={{
              fontSize: "14px",
              color: "#D5D6DA",
            }}
          >
            {subtitle}
          </p>
        )}

        {/* Price */}
        <div className="flex items-center gap-3 mt-4">
          <span
            className="font-bold"
            style={{
              fontSize: "24px",
              color: "#C89B4F",
            }}
          >
            ${product.price.toFixed(2)}
          </span>
          {isOnSale && product.compare_at_price && (
            <span
              className="line-through"
              style={{
                fontSize: "16px",
                color: "#73747A",
              }}
            >
              ${product.compare_at_price.toFixed(2)}
            </span>
          )}
        </div>

        {/* Description */}
        {product.description && (
          <p
            className="mt-6"
            style={{
              fontSize: "14px",
              lineHeight: "1.6",
              color: "#D5D6DA",
            }}
          >
            {product.description}
          </p>
        )}

        {/* Nutrition facts card */}
        {(product.protein_grams || product.calories) && (
          <div
            className="flex items-center gap-6 mt-6 p-4 rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            {product.protein_grams && (
              <div className="text-center">
                <div
                  className="font-bold"
                  style={{ fontSize: "20px", color: "#C89B4F" }}
                >
                  {product.protein_grams}g
                </div>
                <div
                  className="uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#73747A" }}
                >
                  Protein
                </div>
              </div>
            )}
            {product.protein_grams && product.calories && (
              <div className="w-px h-10" style={{ backgroundColor: "rgba(255,255,255,0.1)" }} />
            )}
            {product.calories && (
              <div className="text-center">
                <div
                  className="font-bold"
                  style={{ fontSize: "20px", color: "#D5D6DA" }}
                >
                  {product.calories}
                </div>
                <div
                  className="uppercase"
                  style={{ fontSize: "10px", letterSpacing: "0.1em", color: "#73747A" }}
                >
                  Calories
                </div>
              </div>
            )}
          </div>
        )}

        {/* Stock warning */}
        {!product.is_in_stock && (
          <div
            className="mt-6 p-4 rounded-xl text-sm"
            style={{
              backgroundColor: "rgba(229, 62, 62, 0.1)",
              border: "1px solid rgba(229, 62, 62, 0.3)",
              color: "#FC8181",
            }}
          >
            This product is currently out of stock. Check back later!
          </div>
        )}

        {/* Quantity and Add to Cart */}
        <div className="flex items-center gap-4 mt-8">
          {/* Quantity selector */}
          <div
            className="flex items-center rounded-xl"
            style={{ backgroundColor: "rgba(255,255,255,0.05)" }}
          >
            <button
              onClick={decrementQuantity}
              disabled={!product.is_in_stock || quantity <= 1}
              className="w-12 h-12 flex items-center justify-center transition-opacity disabled:opacity-40"
              style={{ color: "#D5D6DA" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>
            <span
              className="w-10 text-center font-semibold"
              style={{ fontSize: "16px", color: "#D5D6DA" }}
            >
              {quantity}
            </span>
            <button
              onClick={incrementQuantity}
              disabled={!product.is_in_stock}
              className="w-12 h-12 flex items-center justify-center transition-opacity disabled:opacity-40"
              style={{ color: "#D5D6DA" }}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Add to Cart button */}
          <button
            onClick={handleAddToCart}
            disabled={!product.is_in_stock || isAdding}
            className="flex-1 h-12 rounded-xl font-extrabold uppercase flex items-center justify-center gap-2 transition-all duration-200"
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
        </div>

        {/* Free shipping note */}
        <p
          className="text-center mt-4"
          style={{ fontSize: "12px", color: "#73747A" }}
        >
          Free shipping on orders over $50
        </p>
      </div>
    </div>
  );
}
