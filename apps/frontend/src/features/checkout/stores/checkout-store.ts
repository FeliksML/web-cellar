/**
 * Zustand store for checkout state
 *
 * Manages the checkout flow state including:
 * - Current step in the checkout process
 * - Shipping address (for guest checkout or new address)
 * - Selected saved address ID (for authenticated users)
 * - Delivery preferences (date, time slot, fulfillment type)
 *
 * Note: Orders are now created server-side via the orders API.
 * The store no longer maintains a local orders array.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  ShippingAddress,
  CheckoutStep,
  DeliveryPreferences,
} from "../types";

interface CheckoutState {
  // Current step in checkout flow
  currentStep: CheckoutStep;

  // For guest checkout: manually entered address
  shippingAddress: ShippingAddress | null;

  // For authenticated users: selected saved address ID
  selectedAddressId: number | null;

  // Delivery preferences (date, time slot, fulfillment type)
  deliveryPreferences: DeliveryPreferences | null;

  // Contact info (separate from address for flexibility)
  contactEmail: string;
  contactPhone: string;

  // Customer notes for the order
  customerNotes: string;

  // Actions
  setStep: (step: CheckoutStep) => void;
  setShippingAddress: (address: ShippingAddress) => void;
  setSelectedAddressId: (id: number | null) => void;
  setDeliveryPreferences: (preferences: DeliveryPreferences) => void;
  setContactInfo: (email: string, phone: string) => void;
  setCustomerNotes: (notes: string) => void;
  resetCheckout: () => void;
}

export const useCheckoutStore = create<CheckoutState>()(
  persist(
    (set) => ({
      currentStep: "cart",
      shippingAddress: null,
      selectedAddressId: null,
      deliveryPreferences: null,
      contactEmail: "",
      contactPhone: "",
      customerNotes: "",

      setStep: (step) => set({ currentStep: step }),

      setShippingAddress: (address) =>
        set({
          shippingAddress: address,
          // Clear selected address when entering a new one
          selectedAddressId: null,
        }),

      setSelectedAddressId: (id) =>
        set({
          selectedAddressId: id,
          // Clear manual address when selecting a saved one
          shippingAddress: null,
        }),

      setDeliveryPreferences: (preferences) =>
        set({ deliveryPreferences: preferences }),

      setContactInfo: (email, phone) =>
        set({ contactEmail: email, contactPhone: phone }),

      setCustomerNotes: (notes) => set({ customerNotes: notes }),

      resetCheckout: () =>
        set({
          currentStep: "cart",
          shippingAddress: null,
          selectedAddressId: null,
          deliveryPreferences: null,
          contactEmail: "",
          contactPhone: "",
          customerNotes: "",
        }),
    }),
    {
      name: "beasty-baker-checkout",
      // Persist shipping address and contact info for convenience
      partialize: (state) => ({
        shippingAddress: state.shippingAddress,
        contactEmail: state.contactEmail,
        contactPhone: state.contactPhone,
      }),
    }
  )
);

/**
 * Get the default delivery preferences
 */
export function getDefaultDeliveryPreferences(): DeliveryPreferences {
  // Default to tomorrow for delivery
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  return {
    fulfillmentType: "delivery",
    requestedDate: tomorrow.toISOString().split("T")[0],
    timeSlot: "afternoon",
  };
}
