/**
 * Mobile product grid component
 * 2-column grid layout matching UI spec
 */

import type { ProductListItem } from "../types";
import { MobileProductCard } from "./mobile-product-card";

interface MobileProductGridProps {
  products: ProductListItem[];
  isLoading?: boolean;
  onAddToCart: (product: ProductListItem) => void;
}

export function MobileProductGrid({
  products,
  isLoading,
  onAddToCart,
}: MobileProductGridProps) {
  if (isLoading) {
    return <MobileProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 px-5">
        <div className="mb-4">
          <svg
            className="w-16 h-16 mx-auto opacity-30"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: "#D5D6DA" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
            />
          </svg>
        </div>
        <p className="text-lg font-medium" style={{ color: "#D5D6DA" }}>
          No products found
        </p>
        <p className="text-sm mt-2" style={{ color: "#8B8D92" }}>
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div
      className="grid grid-cols-2 gap-4"
      style={{ padding: "0 20px" }}
    >
      {products.map((product) => (
        <MobileProductCard
          key={product.id}
          product={product}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

function MobileProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4" style={{ padding: "0 20px" }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="animate-pulse rounded-[18px] flex flex-col items-center p-4"
          style={{
            height: "210px",
            backgroundColor: "#25262B",
          }}
        >
          {/* Image skeleton */}
          <div
            className="w-16 h-16 rounded-lg mt-2"
            style={{ backgroundColor: "#2B2D33" }}
          />
          {/* Title skeleton */}
          <div
            className="w-3/4 h-5 rounded mt-4"
            style={{ backgroundColor: "#2B2D33" }}
          />
          {/* Subtitle skeleton */}
          <div
            className="w-1/2 h-3 rounded mt-2"
            style={{ backgroundColor: "#2B2D33" }}
          />
          {/* Button skeleton */}
          <div
            className="w-full h-[40px] rounded-[12px] mt-auto"
            style={{ backgroundColor: "#2B2D33" }}
          />
        </div>
      ))}
    </div>
  );
}
