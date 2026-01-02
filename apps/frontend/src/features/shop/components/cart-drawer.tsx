/**
 * Cart drawer (slide-in from right)
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCartStore, useCartSummary, type CartItem } from "../stores/cart-store";

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCartStore();

  const handleIncrement = () => {
    updateQuantity(item.product.id, item.quantity + 1);
  };

  const handleDecrement = () => {
    updateQuantity(item.product.id, item.quantity - 1);
  };

  return (
    <div className="flex gap-4 py-4 border-b border-neutral-800/50">
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
        <h4 className="text-sm font-medium text-primary-200 truncate mb-1">
          {item.product.name}
        </h4>
        <p className="text-sm text-primary-400 font-semibold mb-2">
          ${item.product.price.toFixed(2)}
        </p>

        {/* Quantity controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDecrement}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-800/60 border border-neutral-700/50 text-neutral-300 hover:border-neutral-600/50 hover:text-neutral-100 transition-all"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
            </svg>
          </button>

          <span className="w-8 text-center text-sm text-neutral-200 font-medium">
            {item.quantity}
          </span>

          <button
            onClick={handleIncrement}
            className="w-7 h-7 flex items-center justify-center rounded-full bg-neutral-800/60 border border-neutral-700/50 text-neutral-300 hover:border-neutral-600/50 hover:text-neutral-100 transition-all"
          >
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
      </div>

      {/* Remove button */}
      <button
        onClick={() => removeItem(item.product.id)}
        className="p-1.5 text-neutral-500 hover:text-red-400 transition-colors"
        aria-label="Remove item"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}

export function CartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, closeCart, clearCart } = useCartStore();
  const { subtotal, isEmpty } = useCartSummary();
  const [isAnimating, setIsAnimating] = useState(false);

  const handleCheckout = () => {
    closeCart();
    navigate("/checkout");
  };

  // Handle entrance animation
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCart();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeCart}
      />

      {/* Drawer */}
      <div
        className={`absolute right-0 top-0 bottom-0 w-full max-w-md bg-neutral-900 shadow-2xl transition-transform duration-300 ease-out ${
          isAnimating ? "translate-x-0" : "translate-x-full"
        }`}
        style={{
          boxShadow: "-10px 0 50px -15px rgba(0,0,0,0.5)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-neutral-800">
          <h2 className="font-display text-xl font-semibold text-primary-200">
            Your Cart
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-full bg-neutral-800/60 border border-neutral-700/50 text-neutral-400 hover:text-neutral-200 hover:border-neutral-600/50 transition-all"
            aria-label="Close cart"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100%-180px)] overflow-hidden">
          {isEmpty ? (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <div className="w-16 h-16 mb-4 rounded-full bg-neutral-800/50 flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-neutral-300 mb-2">
                Your cart is empty
              </h3>
              <p className="text-sm text-neutral-500 mb-6">
                Add some delicious treats to get started!
              </p>
              <button
                onClick={closeCart}
                className="px-6 py-2.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider text-sm rounded-full shadow-lg shadow-primary-500/25 transition-all"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <>
              {/* Cart items */}
              <div className="flex-1 overflow-auto px-4">
                {items.map((item) => (
                  <CartItemRow key={item.product.id} item={item} />
                ))}
              </div>

              {/* Clear cart button */}
              <div className="px-4 py-2">
                <button
                  onClick={clearCart}
                  className="text-sm text-neutral-500 hover:text-red-400 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        {!isEmpty && (
          <div className="absolute bottom-0 left-0 right-0 p-4 bg-neutral-900 border-t border-neutral-800">
            {/* Subtotal */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-neutral-400">Subtotal</span>
              <span className="text-xl font-semibold text-primary-200">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <button
              onClick={handleCheckout}
              className="w-full py-3.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
            >
              Proceed to Checkout
            </button>

            <p className="text-xs text-neutral-500 text-center mt-3">
              Shipping calculated at checkout
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
