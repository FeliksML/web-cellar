/**
 * Payment step component for checkout flow
 * Wraps Stripe Elements provider and payment form
 */

import { useState, useMemo } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { env } from "@/config/env";
import { PaymentForm, MockPaymentForm } from "./payment-form";

interface PaymentStepProps {
  total: number;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

// Initialize Stripe outside component to avoid recreation
const stripePromise = env.stripePublishableKey
  ? loadStripe(env.stripePublishableKey)
  : null;

// Check if we're in mock mode
const USE_MOCK_PAYMENT = !env.stripePublishableKey;

export function PaymentStep({
  total,
  onSubmit,
  onBack,
  isSubmitting = false,
}: PaymentStepProps) {
  const [isPaymentReady, setIsPaymentReady] = useState(false);

  // Stripe Elements appearance to match dark theme
  const elementsOptions = useMemo(
    () => ({
      appearance: {
        theme: "night" as const,
        variables: {
          colorPrimary: "#D99E3B",
          colorBackground: "#262626",
          colorText: "#f5f5f5",
          colorDanger: "#ef4444",
          fontFamily: "'Inter', system-ui, sans-serif",
          borderRadius: "12px",
        },
      },
    }),
    []
  );

  const handleSubmit = () => {
    if (!isPaymentReady) return;
    onSubmit();
  };

  const formattedTotal = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(total);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Payment</h2>
        <p className="text-foreground/60 text-sm">
          Complete your order by providing payment details
        </p>
      </div>

      {/* Order Total */}
      <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
        <div className="flex items-center justify-between">
          <span className="text-foreground/70">Order Total</span>
          <span className="text-xl font-semibold text-primary-400">
            {formattedTotal}
          </span>
        </div>
      </div>

      {/* Payment Form */}
      {USE_MOCK_PAYMENT ? (
        <MockPaymentForm
          onPaymentReady={setIsPaymentReady}
          disabled={isSubmitting}
        />
      ) : (
        stripePromise && (
          <Elements stripe={stripePromise} options={elementsOptions}>
            <PaymentForm
              onPaymentReady={setIsPaymentReady}
              disabled={isSubmitting}
            />
          </Elements>
        )
      )}

      {/* Security Notice */}
      <div className="flex items-start gap-3 p-4 bg-secondary-500/10 rounded-lg border border-secondary-500/20">
        <ShieldCheck className="w-5 h-5 text-secondary-400 flex-shrink-0 mt-0.5" />
        <div className="text-sm">
          <p className="font-medium text-secondary-400 mb-1">Secure Checkout</p>
          <p className="text-foreground/60">
            Your payment is processed securely. We never store your full card details.
          </p>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Delivery
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !isPaymentReady}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Processing...
            </>
          ) : (
            <>
              Pay {formattedTotal}
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
