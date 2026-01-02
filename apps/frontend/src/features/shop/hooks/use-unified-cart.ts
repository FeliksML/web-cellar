/**
 * Unified cart hook that abstracts the difference between guest and authenticated carts
 *
 * - For authenticated users: Uses server-side cart via TanStack Query
 * - For guest users: Uses localStorage cart via Zustand
 */

import { useCallback, useMemo } from "react";
import { useAuthStore } from "@/features/auth";
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useRemoveCartItem,
  useClearCart,
  useMergeCart,
} from "../api/cart";
import {
  useCartStore,
  useGuestCartSummary,
  type LocalCartItem,
} from "../stores/cart-store";
import { getSessionId } from "../utils/session";
import type { ProductListItem, ServerCartItem } from "../types";

export interface UnifiedCartItem {
  id: number;
  productId: number;
  product: ProductListItem;
  quantity: number;
  unitPrice: number;
  specialInstructions?: string;
  lineTotal: number;
}

export interface UnifiedCart {
  items: UnifiedCartItem[];
  itemCount: number;
  subtotal: number;
  isEmpty: boolean;
  isLoading: boolean;
  isError: boolean;
  requestedDeliveryDate?: string | null;
  deliveryTimeSlot?: string | null;
}

export interface UseUnifiedCartReturn {
  cart: UnifiedCart;
  isAuthenticated: boolean;

  // Actions
  addItem: (
    product: ProductListItem,
    quantity?: number,
    specialInstructions?: string
  ) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  updateSpecialInstructions: (itemId: number, instructions: string) => void;
  removeItem: (itemId: number) => void;
  clearCart: () => void;

  // UI state
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Auth integration
  mergeGuestCart: () => Promise<void>;

  // Loading states for mutations
  isAdding: boolean;
  isUpdating: boolean;
  isRemoving: boolean;
  isClearing: boolean;
}

/**
 * Convert server cart item to unified format
 */
function serverItemToUnified(item: ServerCartItem): UnifiedCartItem {
  return {
    id: item.id,
    productId: item.product_id,
    product: item.product,
    quantity: item.quantity,
    unitPrice: item.unit_price,
    specialInstructions: item.special_instructions ?? undefined,
    lineTotal: item.line_total,
  };
}

/**
 * Convert local cart item to unified format
 * Uses negative IDs for local items (they don't have server IDs)
 */
function localItemToUnified(
  item: LocalCartItem,
  index: number
): UnifiedCartItem {
  return {
    id: -(index + 1), // Negative ID for local items
    productId: item.product.id,
    product: item.product,
    quantity: item.quantity,
    unitPrice: item.product.price,
    specialInstructions: item.specialInstructions,
    lineTotal: item.product.price * item.quantity,
  };
}

/**
 * Unified cart hook
 */
export function useUnifiedCart(): UseUnifiedCartReturn {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Server cart (for authenticated users)
  const serverCart = useCart({ enabled: isAuthenticated });

  // Guest cart (from Zustand store)
  const guestSummary = useGuestCartSummary();
  const {
    items: guestItems,
    addItem: addGuestItem,
    removeItem: removeGuestItem,
    updateQuantity: updateGuestQuantity,
    updateSpecialInstructions: updateGuestInstructions,
    clearCart: clearGuestCart,
    clearGuestSession,
    isOpen,
    openCart,
    closeCart,
    toggleCart,
  } = useCartStore();

  // Server cart mutations
  const addToCartMutation = useAddToCart();
  const updateCartItemMutation = useUpdateCartItem();
  const removeCartItemMutation = useRemoveCartItem();
  const clearCartMutation = useClearCart();
  const mergeCartMutation = useMergeCart();

  // Build unified cart
  const cart = useMemo<UnifiedCart>(() => {
    if (isAuthenticated && serverCart.data) {
      const data = serverCart.data;
      return {
        items: data.items.map(serverItemToUnified),
        itemCount: data.item_count,
        subtotal: data.subtotal,
        isEmpty: data.is_empty,
        isLoading: serverCart.isLoading,
        isError: serverCart.isError,
        requestedDeliveryDate: data.requested_delivery_date,
        deliveryTimeSlot: data.delivery_time_slot,
      };
    }

    // Guest cart
    return {
      items: guestItems.map(localItemToUnified),
      itemCount: guestSummary.totalItems,
      subtotal: guestSummary.subtotal,
      isEmpty: guestSummary.isEmpty,
      isLoading: isAuthenticated ? serverCart.isLoading : false,
      isError: isAuthenticated ? serverCart.isError : false,
      requestedDeliveryDate: null,
      deliveryTimeSlot: null,
    };
  }, [isAuthenticated, serverCart, guestItems, guestSummary]);

  // Add item
  const addItem = useCallback(
    (
      product: ProductListItem,
      quantity = 1,
      specialInstructions?: string
    ) => {
      if (isAuthenticated) {
        addToCartMutation.mutate({
          product_id: product.id,
          quantity,
          special_instructions: specialInstructions,
        });
      } else {
        addGuestItem(product, quantity, specialInstructions);
      }
      openCart();
    },
    [isAuthenticated, addToCartMutation, addGuestItem, openCart]
  );

  // Update quantity
  const updateQuantity = useCallback(
    (itemId: number, quantity: number) => {
      if (quantity <= 0) {
        if (isAuthenticated && itemId > 0) {
          removeCartItemMutation.mutate(itemId);
        } else if (itemId < 0) {
          // Local item - find by index
          const index = Math.abs(itemId) - 1;
          const item = guestItems[index];
          if (item) {
            removeGuestItem(item.product.id);
          }
        }
        return;
      }

      if (isAuthenticated && itemId > 0) {
        updateCartItemMutation.mutate({ itemId, data: { quantity } });
      } else if (itemId < 0) {
        // Local item
        const index = Math.abs(itemId) - 1;
        const item = guestItems[index];
        if (item) {
          updateGuestQuantity(item.product.id, quantity);
        }
      }
    },
    [
      isAuthenticated,
      updateCartItemMutation,
      removeCartItemMutation,
      guestItems,
      updateGuestQuantity,
      removeGuestItem,
    ]
  );

  // Update special instructions
  const updateSpecialInstructions = useCallback(
    (itemId: number, instructions: string) => {
      if (isAuthenticated && itemId > 0) {
        updateCartItemMutation.mutate({
          itemId,
          data: { special_instructions: instructions },
        });
      } else if (itemId < 0) {
        const index = Math.abs(itemId) - 1;
        const item = guestItems[index];
        if (item) {
          updateGuestInstructions(item.product.id, instructions);
        }
      }
    },
    [isAuthenticated, updateCartItemMutation, guestItems, updateGuestInstructions]
  );

  // Remove item
  const removeItem = useCallback(
    (itemId: number) => {
      if (isAuthenticated && itemId > 0) {
        removeCartItemMutation.mutate(itemId);
      } else if (itemId < 0) {
        const index = Math.abs(itemId) - 1;
        const item = guestItems[index];
        if (item) {
          removeGuestItem(item.product.id);
        }
      }
    },
    [isAuthenticated, removeCartItemMutation, guestItems, removeGuestItem]
  );

  // Clear cart
  const clearCart = useCallback(() => {
    if (isAuthenticated) {
      clearCartMutation.mutate();
    } else {
      clearGuestCart();
    }
  }, [isAuthenticated, clearCartMutation, clearGuestCart]);

  // Merge guest cart on login
  const mergeGuestCart = useCallback(async () => {
    const sessionId = getSessionId();
    if (!sessionId || guestItems.length === 0) {
      return;
    }

    try {
      await mergeCartMutation.mutateAsync({ session_id: sessionId });
      // Clear local guest cart after successful merge
      clearGuestSession();
    } catch (error) {
      console.error("Failed to merge guest cart:", error);
    }
  }, [guestItems.length, mergeCartMutation, clearGuestSession]);

  return {
    cart,
    isAuthenticated,

    // Actions
    addItem,
    updateQuantity,
    updateSpecialInstructions,
    removeItem,
    clearCart,

    // UI state
    isOpen,
    openCart,
    closeCart,
    toggleCart,

    // Auth integration
    mergeGuestCart,

    // Loading states
    isAdding: addToCartMutation.isPending,
    isUpdating: updateCartItemMutation.isPending,
    isRemoving: removeCartItemMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
}
