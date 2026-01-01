/**
 * Cart button with item count badge
 */

import { useCartStore, useCartSummary } from "../stores/cart-store";

export function CartButton() {
  const toggleCart = useCartStore((state) => state.toggleCart);
  const { totalItems } = useCartSummary();

  return (
    <button
      onClick={toggleCart}
      className="relative p-2.5 rounded-full bg-neutral-800/60 backdrop-blur-sm border-2 border-neutral-700/50 text-neutral-200 hover:border-primary-400/50 hover:text-primary-200 transition-all duration-200"
      aria-label={`Shopping cart with ${totalItems} items`}
    >
      {/* Cart icon */}
      <svg
        className="w-5 h-5"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
        />
      </svg>

      {/* Badge */}
      {totalItems > 0 && (
        <span className="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-bold bg-primary-500 text-neutral-950 rounded-full shadow-lg shadow-primary-500/25">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
}
