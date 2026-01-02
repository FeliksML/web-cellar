/**
 * Zustand store for checkout state
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ShippingAddress, Order, CheckoutStep } from "../types";

interface CheckoutState {
  // Current step
  currentStep: CheckoutStep;

  // Shipping info
  shippingAddress: ShippingAddress | null;

  // Order history (stored in localStorage)
  orders: Order[];

  // Actions
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  addOrder: (order: Order) => void;
  resetCheckout: () => void;
}

const initialShippingAddress: ShippingAddress = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  apartment: "",
  city: "",
  state: "",
  zipCode: "",
};

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      currentStep: "cart",
      shippingAddress: null,
      orders: [],

      setStep: (step) => set({ currentStep: step }),

      setShippingAddress: (address) => set({ shippingAddress: address }),

      addOrder: (order) =>
        set((state) => ({
          orders: [order, ...state.orders],
        })),

      resetCheckout: () =>
        set({
          currentStep: "cart",
          shippingAddress: initialShippingAddress,
        }),
    }),
    {
      name: "beasty-baker-checkout",
      // Persist orders and shipping address
      partialize: (state) => ({
        orders: state.orders,
        shippingAddress: state.shippingAddress,
      }),
    }
  )
);

/**
 * Generate a unique order number
 */
export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `BB-${timestamp}-${random}`;
}
