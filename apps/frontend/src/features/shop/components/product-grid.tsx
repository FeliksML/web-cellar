/**
 * Product grid component
 */

import type { ProductListItem } from "../types";
import { ShopProductCard } from "./shop-product-card";

interface ProductGridProps {
  products: ProductListItem[];
  isLoading?: boolean;
  onQuickView?: (product: ProductListItem) => void;
  onAddToCart?: (product: ProductListItem) => void;
}

export function ProductGrid({
  products,
  isLoading,
  onQuickView,
  onAddToCart,
}: ProductGridProps) {
  if (isLoading) {
    return <ProductGridSkeleton />;
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-400 text-lg">No products found</p>
        <p className="text-neutral-500 text-sm mt-2">
          Try adjusting your filters
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ShopProductCard
          key={product.id}
          product={product}
          onQuickView={onQuickView}
          onAddToCart={onAddToCart}
        />
      ))}
    </div>
  );
}

/**
 * Loading skeleton for product grid
 */
function ProductGridSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="aspect-square rounded-2xl bg-neutral-800" />
          <div className="mt-4 space-y-2">
            <div className="h-5 bg-neutral-800 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-neutral-800 rounded w-1/2 mx-auto" />
            <div className="h-4 bg-neutral-800 rounded w-1/4 mx-auto" />
          </div>
        </div>
      ))}
    </div>
  );
}
