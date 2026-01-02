/**
 * Checkout page - Multi-step checkout flow
 * Steps: Cart Review → Shipping → Delivery → Payment → Confirmation
 */

import { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/features/landing";
import {
  CartReview,
  ShippingForm,
  OrderSummary,
  CheckoutSuccess,
  DeliveryStep,
  PaymentStep,
  useCheckoutStore,
  type ShippingAddress,
  type CheckoutStep,
  type DeliveryPreferences,
} from "@/features/checkout";
import { useUnifiedCart } from "@/features/shop";
import { useAuthStore } from "@/features/auth";
import { useCreateOrder, type Order } from "@/features/orders";
import { useAddress } from "@/features/addresses";

export function CheckoutPage() {
  const navigate = useNavigate();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const { cart, clearCart } = useUnifiedCart();

  // Checkout store state
  const {
    shippingAddress,
    selectedAddressId,
    deliveryPreferences,
    setShippingAddress,
    setSelectedAddressId,
    setDeliveryPreferences,
    resetCheckout,
  } = useCheckoutStore();

  // Local UI state
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [orderError, setOrderError] = useState<string | null>(null);

  // Fetch selected address details if authenticated
  const { data: _selectedAddress } = useAddress(selectedAddressId ?? 0);

  // Create order mutation
  const createOrderMutation = useCreateOrder();

  // Calculate max lead time from cart items
  const maxLeadTimeHours = useMemo(() => {
    if (!cart.items.length) return 0;
    return Math.max(
      ...cart.items.map((item) => item.product.lead_time_hours ?? 0)
    );
  }, [cart.items]);

  // Redirect if cart is empty and not on confirmation
  useEffect(() => {
    if (cart.isEmpty && step !== "confirmation") {
      navigate("/shop");
    }
  }, [cart.isEmpty, step, navigate]);

  // Handle shipping form submission (for guest checkout or new address)
  const handleShippingSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
    setStep("delivery");
  };

  // Handle address selection (for authenticated users)
  const handleAddressSelect = (addressId: number) => {
    setSelectedAddressId(addressId);
    setStep("delivery");
  };

  // Handle delivery step submission - go to payment
  const handleDeliverySubmit = (preferences: DeliveryPreferences) => {
    setDeliveryPreferences(preferences);
    setStep("payment");
  };

  // Calculate cart total for payment step
  const cartTotal = useMemo(() => {
    const subtotal = cart.items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
    const shippingCost = deliveryPreferences?.fulfillmentType === "pickup" ? 0 : 5.99;
    return subtotal + shippingCost;
  }, [cart.items, deliveryPreferences?.fulfillmentType]);

  // Handle payment step submission - creates the order
  const handlePaymentSubmit = async () => {
    setOrderError(null);

    try {
      // Build the order payload
      const orderData = {
        // Address - either saved address ID or guest address snapshot
        shipping_address_id: isAuthenticated ? selectedAddressId ?? undefined : undefined,
        shipping_address: !isAuthenticated && shippingAddress ? {
          first_name: shippingAddress.firstName,
          last_name: shippingAddress.lastName,
          phone: shippingAddress.phone || null,
          address_line1: shippingAddress.address,
          address_line2: shippingAddress.apartment || null,
          city: shippingAddress.city,
          state: shippingAddress.state,
          postal_code: shippingAddress.zipCode,
          country: "US",
          delivery_instructions: null,
        } : undefined,

        // Fulfillment
        fulfillment_type: deliveryPreferences?.fulfillmentType ?? "delivery",
        requested_date: deliveryPreferences?.requestedDate ?? "",
        requested_time_slot: deliveryPreferences?.timeSlot ?? undefined,

        // Contact
        contact_email: shippingAddress?.email || "",
        contact_phone: shippingAddress?.phone ?? undefined,

        // Payment
        payment_method: "stripe",
      };

      const order = await createOrderMutation.mutateAsync(orderData);

      // Success - clear cart and show confirmation
      clearCart();
      setCompletedOrder(order);
      setStep("confirmation");
      resetCheckout();
    } catch (error) {
      console.error("Order creation failed:", error);
      setOrderError(
        error instanceof Error
          ? error.message
          : "Failed to create order. Please try again."
      );
    }
  };

  // Determine step status for indicators
  const getStepStatus = (targetStep: CheckoutStep): "pending" | "current" | "completed" => {
    const stepOrder: CheckoutStep[] = ["cart", "shipping", "delivery", "payment", "confirmation"];
    const currentIndex = stepOrder.indexOf(step);
    const targetIndex = stepOrder.indexOf(targetStep);

    if (step === targetStep) return "current";
    if (currentIndex > targetIndex) return "completed";
    return "pending";
  };

  // Step indicator component
  const stepIndicator = (
    <div className="flex items-center justify-center gap-1 sm:gap-2 mb-8">
      {/* Cart step */}
      <StepButton
        number={1}
        label="Cart"
        status={getStepStatus("cart")}
        onClick={() => step !== "confirmation" && setStep("cart")}
        disabled={step === "confirmation"}
      />

      <StepDivider />

      {/* Shipping step */}
      <StepButton
        number={2}
        label="Shipping"
        status={getStepStatus("shipping")}
        onClick={() =>
          ["shipping", "delivery", "payment"].includes(step) && setStep("shipping")
        }
        disabled={step === "cart" || step === "confirmation"}
      />

      <StepDivider />

      {/* Delivery step */}
      <StepButton
        number={3}
        label="Delivery"
        status={getStepStatus("delivery")}
        onClick={() =>
          ["delivery", "payment"].includes(step) && setStep("delivery")
        }
        disabled={!["delivery", "payment"].includes(step)}
      />

      <StepDivider />

      {/* Payment step */}
      <StepButton
        number={4}
        label="Payment"
        status={getStepStatus("payment")}
        onClick={() => step === "payment" && setStep("payment")}
        disabled={step !== "payment"}
      />

      <StepDivider />

      {/* Confirmation step */}
      <StepButton
        number={5}
        label="Done"
        status={getStepStatus("confirmation")}
        disabled
      />
    </div>
  );

  return (
    <div
      className="min-h-screen text-neutral-100 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{ backgroundImage: "url('/background.png')" }}
    >
      {/* Grain texture overlay */}
      <div className="fixed inset-0 bg-grain pointer-events-none z-10" />

      {/* Vignette overlay */}
      <div className="fixed inset-0 vignette pointer-events-none z-10" />

      {/* Navigation */}
      <LandingNavbar />

      {/* Main content */}
      <main className="relative z-20 pt-24 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 text-sm text-neutral-400 hover:text-neutral-200 transition-colors mb-4"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Shop
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-primary-200">
              Checkout
            </h1>
          </div>

          {/* Step indicator */}
          {stepIndicator}

          {/* Error message */}
          {orderError && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">
              {orderError}
            </div>
          )}

          {/* Content based on step */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main content area */}
            <div className="lg:col-span-2">
              <div className="bg-neutral-900/60 backdrop-blur-sm rounded-2xl border border-neutral-800/50 p-6 sm:p-8">
                {step === "cart" && (
                  <CartReview onContinue={() => setStep("shipping")} />
                )}

                {step === "shipping" && (
                  <ShippingForm
                    initialData={shippingAddress}
                    selectedAddressId={selectedAddressId}
                    isAuthenticated={isAuthenticated}
                    onSubmit={handleShippingSubmit}
                    onSelectAddress={handleAddressSelect}
                    onBack={() => setStep("cart")}
                  />
                )}

                {step === "delivery" && (
                  <DeliveryStep
                    initialPreferences={deliveryPreferences}
                    minLeadTimeHours={maxLeadTimeHours}
                    onSubmit={handleDeliverySubmit}
                    onBack={() => setStep("shipping")}
                  />
                )}

                {step === "payment" && (
                  <PaymentStep
                    total={cartTotal}
                    onSubmit={handlePaymentSubmit}
                    onBack={() => setStep("delivery")}
                    isSubmitting={createOrderMutation.isPending}
                  />
                )}

                {step === "confirmation" && completedOrder && (
                  <CheckoutSuccess order={completedOrder as any} />
                )}
              </div>
            </div>

            {/* Order summary sidebar - hidden on confirmation */}
            {step !== "confirmation" && (
              <div className="lg:col-span-1">
                <OrderSummary
                  showEditButton={step !== "cart"}
                  onEdit={() => setStep("cart")}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

// Step button component
interface StepButtonProps {
  number: number;
  label: string;
  status: "pending" | "current" | "completed";
  onClick?: () => void;
  disabled?: boolean;
}

function StepButton({
  number,
  label,
  status,
  onClick,
  disabled,
}: StepButtonProps) {
  const isClickable = !disabled && onClick;

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center gap-2 ${
        status === "current" ? "text-primary-200" : "text-neutral-500"
      } ${isClickable ? "cursor-pointer" : "cursor-default"}`}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition ${
          status === "current"
            ? "bg-primary-500 text-neutral-950"
            : status === "completed"
            ? "bg-secondary-500 text-neutral-950"
            : "bg-neutral-700 text-neutral-400"
        }`}
      >
        {status === "completed" ? (
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        ) : (
          number
        )}
      </span>
      <span className="hidden sm:inline font-medium">{label}</span>
    </button>
  );
}

function StepDivider() {
  return <div className="w-8 sm:w-12 h-px bg-neutral-700" />;
}
