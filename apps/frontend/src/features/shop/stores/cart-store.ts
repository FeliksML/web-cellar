/**
 * Zustand store for shopping cart
 *
 * Hybrid cart implementation:
 * - Guest users: localStorage cart with session ID
 * - Authenticated users: Server-side cart via TanStack Query
 *
 * This store manages:
 * - UI state (cart drawer open/closed)
 * - Guest cart items (localStorage persistence)
 * - Session ID for guest carts
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ProductListItem } from "../types";
import {
  getOrCreateSessionId,
  clearSessionId,
  getSessionId,
} from "../utils/session";

export interface LocalCartItem {
  product: ProductListItem;
  quantity: number;
  specialInstructions?: string;
}

interface CartUIState {
  isOpen: boolean;
}

interface GuestCartState {
  items: LocalCartItem[];
}

interface CartActions {
  // UI actions
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;

  // Guest cart actions
  addItem: (
    product: ProductListItem,
    quantity?: number,
    specialInstructions?: string
  ) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  updateSpecialInstructions: (productId: number, instructions: string) => void;
  clearCart: () => void;

  // Session management
  getSessionId: () => string;
  clearGuestSession: () => void;

  // Computed getters
  getTotalItems: () => number;
  getSubtotal: () => number;
}

type CartStore = CartUIState & GuestCartState & CartActions;

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      // UI State
      isOpen: false,

      // Guest Cart State
      items: [],

      // UI Actions
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),

      // Guest Cart Actions
      addItem: (product, quantity = 1, specialInstructions) => {
        // Ensure session exists for guest cart
        getOrCreateSessionId();

        set((state) => {
          const existingItem = state.items.find(
            (item) => item.product.id === product.id
          );

          if (existingItem) {
            // Update quantity if item exists
            return {
              items: state.items.map((item) =>
                item.product.id === product.id
                  ? {
                      ...item,
                      quantity: item.quantity + quantity,
                      specialInstructions:
                        specialInstructions ?? item.specialInstructions,
                    }
                  : item
              ),
              isOpen: true,
            };
          }

          // Add new item
          return {
            items: [...state.items, { product, quantity, specialInstructions }],
            isOpen: true,
          };
        });
      },

      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.product.id !== productId),
        }));
      },

      updateQuantity: (productId, quantity) => {
        if (quantity <= 0) {
          get().removeItem(productId);
          return;
        }

        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }));
      },

      updateSpecialInstructions: (productId, instructions) => {
        set((state) => ({
          items: state.items.map((item) =>
            item.product.id === productId
              ? { ...item, specialInstructions: instructions }
              : item
          ),
        }));
      },

      clearCart: () => {
        set({ items: [] });
      },

      // Session Management
      getSessionId: () => {
        return getOrCreateSessionId();
      },

      clearGuestSession: () => {
        clearSessionId();
        set({ items: [] });
      },

      // Computed Getters
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getSubtotal: () => {
        return get().items.reduce(
          (total, item) => total + item.product.price * item.quantity,
          0
        );
      },
    }),
    {
      name: "beasty-baker-cart",
      // Only persist cart items, not UI state
      partialize: (state) => ({ items: state.items }),
    }
  )
);

/**
 * Hook to get computed cart values for guest cart
 */
export function useGuestCartSummary() {
  const items = useCartStore((state) => state.items);

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const subtotal = items.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return { totalItems, subtotal, isEmpty: items.length === 0, items };
}

/**
 * Check if there's an existing guest session with items
 */
export function hasGuestCart(): boolean {
  const sessionId = getSessionId();
  const items = useCartStore.getState().items;
  return sessionId !== null && items.length > 0;
}

/**
 * Get guest cart items for merge
 */
export function getGuestCartForMerge(): {
  sessionId: string | null;
  items: LocalCartItem[];
} {
  return {
    sessionId: getSessionId(),
    items: useCartStore.getState().items,
  };
}

/**
 * Alias for backwards compatibility
 */
export const useCartSummary = useGuestCartSummary;

/**
 * Type alias for backwards compatibility
 */
export type CartItem = LocalCartItem;
