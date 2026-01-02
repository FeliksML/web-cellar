/**
 * Payment form component using Stripe Elements
 * Handles credit card input with full Stripe integration
 */

import { useState } from "react";
import {
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import type { StripeCardElementChangeEvent } from "@stripe/stripe-js";
import { CreditCard, Lock, AlertCircle } from "lucide-react";

interface PaymentFormProps {
  onPaymentReady: (isReady: boolean) => void;
  disabled?: boolean;
}

// Card element styling to match the dark theme
const cardElementOptions = {
  style: {
    base: {
      fontSize: "16px",
      color: "#f5f5f5",
      fontFamily: "'Inter', system-ui, sans-serif",
      "::placeholder": {
        color: "#737373",
      },
      iconColor: "#D99E3B",
    },
    invalid: {
      color: "#ef4444",
      iconColor: "#ef4444",
    },
  },
};

export function PaymentForm({ onPaymentReady, disabled = false }: PaymentFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const handleCardChange = (event: StripeCardElementChangeEvent) => {
    setError(event.error?.message || null);
    setCardComplete(event.complete);
    onPaymentReady(event.complete && !event.error);
  };

  const isStripeReady = stripe && elements;

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 text-sm text-foreground/70">
        <CreditCard className="w-4 h-4" />
        <span>Credit or Debit Card</span>
      </div>

      <div
        className={`
          p-4 bg-neutral-800/60 border rounded-xl transition
          ${error ? "border-red-500" : cardComplete ? "border-primary-500" : "border-neutral-700/50"}
          ${disabled ? "opacity-50 pointer-events-none" : ""}
        `}
      >
        {isStripeReady ? (
          <CardElement
            options={cardElementOptions}
            onChange={handleCardChange}
          />
        ) : (
          <div className="text-sm text-foreground/50 animate-pulse">
            Loading payment form...
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-foreground/50">
        <Lock className="w-3 h-3" />
        <span>Your payment info is encrypted and secure</span>
      </div>
    </div>
  );
}

/**
 * Mock payment form for testing without Stripe
 * Used when VITE_STRIPE_PUBLISHABLE_KEY is not set
 */
export function MockPaymentForm({ onPaymentReady, disabled = false }: PaymentFormProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [error, setError] = useState<string | null>(null);

  const validateCard = (number: string) => {
    // Accept test card numbers
    const testCards = ["4242424242424242", "4000000000000002", "5555555555554444"];
    return testCards.includes(number.replace(/\s/g, ""));
  };

  const handleCardChange = (value: string) => {
    // Format card number with spaces
    const cleaned = value.replace(/\D/g, "");
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, "$1 ").trim();
    setCardNumber(formatted.slice(0, 19));
    setError(null);
    checkComplete(formatted, expiry, cvc);
  };

  const handleExpiryChange = (value: string) => {
    // Format as MM/YY
    const cleaned = value.replace(/\D/g, "");
    let formatted = cleaned;
    if (cleaned.length >= 2) {
      formatted = cleaned.slice(0, 2) + "/" + cleaned.slice(2, 4);
    }
    setExpiry(formatted.slice(0, 5));
    checkComplete(cardNumber, formatted, cvc);
  };

  const handleCvcChange = (value: string) => {
    const cleaned = value.replace(/\D/g, "").slice(0, 4);
    setCvc(cleaned);
    checkComplete(cardNumber, expiry, cleaned);
  };

  const checkComplete = (card: string, exp: string, cvcVal: string) => {
    const cardClean = card.replace(/\s/g, "");
    const isComplete = cardClean.length === 16 && exp.length === 5 && cvcVal.length >= 3;

    if (isComplete && !validateCard(cardClean)) {
      setError("Use test card: 4242 4242 4242 4242");
      onPaymentReady(false);
    } else {
      onPaymentReady(isComplete);
    }
  };

  const inputClass = `
    w-full px-4 py-3 bg-neutral-800/60 border border-neutral-700/50 rounded-xl
    text-neutral-100 placeholder-neutral-500 focus:outline-none focus:ring-2
    focus:ring-primary-400/50 focus:border-primary-400 transition-all
  `;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-foreground/70">
          <CreditCard className="w-4 h-4" />
          <span>Credit or Debit Card</span>
        </div>
        <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded">
          Test Mode
        </span>
      </div>

      <div className={`space-y-3 ${disabled ? "opacity-50 pointer-events-none" : ""}`}>
        <div>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => handleCardChange(e.target.value)}
            placeholder="Card number (4242 4242 4242 4242)"
            className={inputClass}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="text"
            value={expiry}
            onChange={(e) => handleExpiryChange(e.target.value)}
            placeholder="MM/YY"
            className={inputClass}
          />
          <input
            type="text"
            value={cvc}
            onChange={(e) => handleCvcChange(e.target.value)}
            placeholder="CVC"
            className={inputClass}
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-amber-400">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}

      <div className="flex items-center gap-2 text-xs text-foreground/50">
        <Lock className="w-3 h-3" />
        <span>Test mode - no real charges will be made</span>
      </div>
    </div>
  );
}
