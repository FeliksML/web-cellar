/**
 * Mobile shop view component
 * Clean, minimal layout matching the reference
 */

import { useState } from "react";
import type { ProductListItem } from "../types";
import { MobileProductGrid } from "./mobile-product-grid";
import { MobileFilterDrawer } from "./mobile-filter-drawer";
import { useFilterStore } from "../stores/filter-store";

interface MobileShopViewProps {
  products: ProductListItem[];
  isLoading: boolean;
  onAddToCart: (product: ProductListItem) => void;
}

export function MobileShopView({
  products,
  isLoading,
  onAddToCart,
}: MobileShopViewProps) {
  const [filterOpen, setFilterOpen] = useState(false);
  const { category: activeCategory } = useFilterStore();

  return (
    <div className="min-h-screen pb-[120px]">
      {/* Section Label - "SHOP" */}
      <div className="pt-6 pb-2 text-center">
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

      {/* Filter Button */}
      <div className="px-5 pb-4 flex justify-center">
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-full transition-colors"
          style={{
            backgroundColor: "#25262B",
            border: "1px solid rgba(255, 255, 255, 0.06)",
          }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: "#D5D6DA" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span style={{ color: "#D5D6DA", fontSize: "14px", fontWeight: 500 }}>
            Filter
          </span>
          {activeCategory && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#D6A952", color: "#1D1205" }}
            >
              1
            </span>
          )}
        </button>
      </div>

      {/* Product Grid */}
      <MobileProductGrid
        products={products}
        isLoading={isLoading}
        onAddToCart={onAddToCart}
      />

      {/* Filter Drawer */}
      <MobileFilterDrawer
        isOpen={filterOpen}
        onClose={() => setFilterOpen(false)}
      />
    </div>
  );
}
