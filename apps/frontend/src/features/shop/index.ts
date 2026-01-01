/**
 * Shop feature exports
 */

// Components
export { ShopProductCard } from "./components/shop-product-card";
export { ProductGrid } from "./components/product-grid";
export { CategoryPills } from "./components/category-pills";
export { ProductSort } from "./components/product-sort";
export { ProductDetailModal } from "./components/product-detail-modal";
export { DietaryBadges, DietaryBadgesFull } from "./components/dietary-badges";
export { PriceDisplay, SavingsBadge } from "./components/price-display";
export { QuantitySelector } from "./components/quantity-selector";
export { ProductSkeleton, ProductSkeletonGrid } from "./components/product-skeleton";
export { SearchInput } from "./components/search-input";
export { DietaryFilterPills } from "./components/dietary-filter-pills";

// Cart components
export { CartButton } from "./components/cart-button";
export { CartDrawer } from "./components/cart-drawer";

// API hooks
export { useProducts } from "./api/get-products";
export { useFeaturedProducts, useBestsellerProducts } from "./api/get-featured-products";
export { useProduct } from "./api/get-product";
export { useCategories } from "./api/get-categories";

// Stores
export { useFilterStore, useFilterParams } from "./stores/filter-store";
export { useCartStore, useCartSummary } from "./stores/cart-store";
export type { CartItem } from "./stores/cart-store";

// Types
export * from "./types";
