/**
 * Checkout page - Multi-step checkout flow
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LandingNavbar } from "@/features/landing";
import {
  CartReview,
  ShippingForm,
  OrderSummary,
  CheckoutSuccess,
  useCheckoutStore,
  generateOrderNumber,
  type ShippingAddress,
  type Order,
  type CheckoutStep,
} from "@/features/checkout";
import { useCartStore, useCartSummary } from "@/features/shop";

export function CheckoutPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckoutStep>("cart");
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  const { items, clearCart } = useCartStore();
  const { subtotal, isEmpty } = useCartSummary();
  const { shippingAddress, setShippingAddress, addOrder } = useCheckoutStore();

  // Calculate totals
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  // Redirect if cart is empty and not on confirmation
  useEffect(() => {
    if (isEmpty && step !== "confirmation") {
      navigate("/shop");
    }
  }, [isEmpty, step, navigate]);

  const handleShippingSubmit = (data: ShippingAddress) => {
    setShippingAddress(data);
    // In a real app, we'd process payment here
    // For now, create the order immediately
    const order: Order = {
      id: crypto.randomUUID(),
      orderNumber: generateOrderNumber(),
      items: items.map((item) => ({
        productId: item.product.id,
        name: item.product.name,
        price: item.product.price,
        quantity: item.quantity,
        gradient_from: item.product.gradient_from,
        gradient_to: item.product.gradient_to,
      })),
      shipping: data,
      subtotal,
      shipping_cost: shippingCost,
      total,
      status: "confirmed",
      createdAt: new Date().toISOString(),
    };

    addOrder(order);
    setCompletedOrder(order);
    clearCart();
    setStep("confirmation");
  };

  const stepIndicator = (
    <div className="flex items-center justify-center gap-4 mb-8">
      {/* Cart step */}
      <button
        onClick={() => step !== "confirmation" && setStep("cart")}
        className={`flex items-center gap-2 ${
          step === "cart" ? "text-primary-200" : "text-neutral-500"
        } ${step === "confirmation" ? "cursor-default" : "cursor-pointer"}`}
        disabled={step === "confirmation"}
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step === "cart"
              ? "bg-primary-500 text-neutral-950"
              : step === "confirmation" || step === "shipping"
              ? "bg-secondary-500 text-neutral-950"
              : "bg-neutral-700 text-neutral-400"
          }`}
        >
          {step === "shipping" || step === "confirmation" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            "1"
          )}
        </span>
        <span className="hidden sm:inline font-medium">Cart</span>
      </button>

      <div className="w-12 h-px bg-neutral-700" />

      {/* Shipping step */}
      <button
        onClick={() => step === "shipping" && setStep("shipping")}
        className={`flex items-center gap-2 ${
          step === "shipping" ? "text-primary-200" : "text-neutral-500"
        } ${step !== "shipping" ? "cursor-default" : "cursor-pointer"}`}
        disabled={step !== "shipping"}
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step === "shipping"
              ? "bg-primary-500 text-neutral-950"
              : step === "confirmation"
              ? "bg-secondary-500 text-neutral-950"
              : "bg-neutral-700 text-neutral-400"
          }`}
        >
          {step === "confirmation" ? (
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            "2"
          )}
        </span>
        <span className="hidden sm:inline font-medium">Shipping</span>
      </button>

      <div className="w-12 h-px bg-neutral-700" />

      {/* Confirmation step */}
      <div
        className={`flex items-center gap-2 ${
          step === "confirmation" ? "text-primary-200" : "text-neutral-500"
        }`}
      >
        <span
          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
            step === "confirmation"
              ? "bg-primary-500 text-neutral-950"
              : "bg-neutral-700 text-neutral-400"
          }`}
        >
          3
        </span>
        <span className="hidden sm:inline font-medium">Confirm</span>
      </div>
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
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Shop
            </Link>
            <h1 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight text-primary-200">
              Checkout
            </h1>
          </div>

          {/* Step indicator */}
          {stepIndicator}

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
                    onSubmit={handleShippingSubmit}
                    onBack={() => setStep("cart")}
                  />
                )}

                {step === "confirmation" && completedOrder && (
                  <CheckoutSuccess order={completedOrder} />
                )}
              </div>
            </div>

            {/* Order summary sidebar - hidden on confirmation */}
            {step !== "confirmation" && (
              <div className="lg:col-span-1">
                <OrderSummary
                  showEditButton={step === "shipping"}
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
