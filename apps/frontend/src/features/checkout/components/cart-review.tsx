/**
 * Cart review step - first step of checkout
 */

import { useCartStore, useCartSummary } from "@/features/shop/stores/cart-store";
import { Link } from "react-router-dom";

interface CartReviewProps {
  onContinue: () => void;
}

export function CartReview({ onContinue }: CartReviewProps) {
  const { items, updateQuantity, removeItem } = useCartStore();
  const { subtotal, isEmpty } = useCartSummary();

  // Mock shipping cost (free over $50)
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  if (isEmpty) {
    return (
      <div className="text-center py-16">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
          <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
          </svg>
        </div>
        <h2 className="text-xl font-semibold text-neutral-300 mb-2">
          Your cart is empty
        </h2>
        <p className="text-neutral-500 mb-6">
          Add some delicious treats before checking out!
        </p>
        <Link
          to="/shop"
          className="inline-flex px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider text-sm rounded-full shadow-lg shadow-primary-500/25 transition-all"
        >
          Browse Products
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h2 className="font-display text-2xl font-semibold text-primary-200 mb-6">
        Review Your Cart
      </h2>

      {/* Cart items */}
      <div className="space-y-4 mb-8">
        {items.map((item) => (
          <div
            key={item.product.id}
            className="flex gap-4 p-4 bg-neutral-800/40 rounded-xl border border-neutral-700/50"
          >
            {/* Product image */}
            <div className="w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
              {item.product.primary_image_url ? (
                <img
                  src={item.product.primary_image_url}
                  alt={item.product.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{
                    background: `linear-gradient(135deg, ${item.product.gradient_from || "#6366F1"}, ${item.product.gradient_to || "#8B5CF6"})`,
                  }}
                >
                  <span className="text-white/60 text-xs font-medium uppercase">
                    Treat
                  </span>
                </div>
              )}
            </div>

            {/* Product info */}
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-neutral-200 mb-1">
                {item.product.name}
              </h4>
              <p className="text-sm text-primary-400 font-semibold mb-3">
                ${item.product.price.toFixed(2)} each
              </p>

              {/* Quantity controls */}
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-700/60 border border-neutral-600/50 text-neutral-300 hover:border-neutral-500/50 hover:text-neutral-100 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                    </svg>
                  </button>

                  <span className="w-10 text-center text-neutral-200 font-medium">
                    {item.quantity}
                  </span>

                  <button
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                    className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-700/60 border border-neutral-600/50 text-neutral-300 hover:border-neutral-500/50 hover:text-neutral-100 transition-all"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>

                <button
                  onClick={() => removeItem(item.product.id)}
                  className="text-sm text-neutral-500 hover:text-red-400 transition-colors"
                >
                  Remove
                </button>
              </div>
            </div>

            {/* Line total */}
            <div className="text-right">
              <p className="text-lg font-semibold text-neutral-200">
                ${(item.product.price * item.quantity).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Totals */}
      <div className="bg-neutral-800/40 rounded-xl border border-neutral-700/50 p-6 mb-8">
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Subtotal</span>
            <span className="text-neutral-200">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-neutral-400">Shipping</span>
            <span className="text-neutral-200">
              {shippingCost === 0 ? (
                <span className="text-secondary-400">Free</span>
              ) : (
                `$${shippingCost.toFixed(2)}`
              )}
            </span>
          </div>
        </div>

        {/* Free shipping progress */}
        {subtotal < 50 && (
          <div className="pb-4 border-b border-neutral-700/50 mb-4">
            <p className="text-sm text-neutral-500 mb-2">
              Add ${(50 - subtotal).toFixed(2)} more for free shipping!
            </p>
            <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-neutral-200">Total</span>
          <span className="text-2xl font-bold text-primary-200">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <Link
          to="/shop"
          className="px-6 py-3 text-neutral-300 hover:text-neutral-100 font-medium transition-colors"
        >
          Continue Shopping
        </Link>

        <button
          onClick={onContinue}
          className="flex-1 py-3.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
        >
          Continue to Shipping
        </button>
      </div>
    </div>
  );
}
