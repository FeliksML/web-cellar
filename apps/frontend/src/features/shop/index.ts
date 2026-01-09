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
export { QuantitySelector, BakeryQuantitySelector } from "./components/quantity-selector";
export { ProductSkeleton, ProductSkeletonGrid } from "./components/product-skeleton";
export { SearchInput } from "./components/search-input";
export { DietaryFilterPills } from "./components/dietary-filter-pills";

// Mobile components
export { MobileProductCard } from "./components/mobile-product-card";
export { MobileProductGrid } from "./components/mobile-product-grid";
export { MobileFilterBar } from "./components/mobile-filter-bar";
export { MobileShopView } from "./components/mobile-shop-view";
export { MobileProductView } from "./components/mobile-product-view";

// Bakery-specific components
export { AllergenBadges, AllergenWarning } from "./components/allergen-badges";
export {
  LeadTimeNotice,
  LeadTimeBadge,
  getEarliestDate,
} from "./components/lead-time-notice";

// Cart components
export { CartButton } from "./components/cart-button";
export { CartDrawer } from "./components/cart-drawer";

// API hooks
export { useProducts } from "./api/get-products";
export { useFeaturedProducts, useBestsellerProducts } from "./api/get-featured-products";
export { useProduct } from "./api/get-product";
export { useCategories } from "./api/get-categories";

// Cart API hooks
export {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useMergeCart,
  useUpdateCartDelivery,
  cartKeys,
} from "./api/cart";

// Stores
export { useFilterStore, useFilterParams } from "./stores/filter-store";
export {
  useCartStore,
  useGuestCartSummary,
  hasGuestCart,
  getGuestCartForMerge,
} from "./stores/cart-store";
export type { LocalCartItem } from "./stores/cart-store";

// Hooks
export { useUnifiedCart } from "./hooks/use-unified-cart";
export type { UnifiedCart, UnifiedCartItem, UseUnifiedCartReturn } from "./hooks/use-unified-cart";

// Session utilities
export {
  getSessionId,
  getOrCreateSessionId,
  clearSessionId,
  hasGuestSession,
} from "./utils/session";

// Types
export * from "./types";
