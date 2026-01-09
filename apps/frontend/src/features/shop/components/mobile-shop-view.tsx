/**
 * Mobile shop view component
 * Clean, minimal layout matching the reference
 */

import type { ProductListItem } from "../types";
import { MobileProductGrid } from "./mobile-product-grid";

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
  return (
    <div className="min-h-screen pb-[120px]">
      {/* Section Label - "SHOP" */}
      <div className="pt-6 pb-4 text-center">
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

      {/* Product Grid */}
      <MobileProductGrid
        products={products}
        isLoading={isLoading}
        onAddToCart={onAddToCart}
      />
    </div>
  );
}
