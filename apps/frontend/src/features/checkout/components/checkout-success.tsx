/**
 * Checkout success / order confirmation component
 */

import { Link } from "react-router-dom";
import type { Order } from "../types";

interface CheckoutSuccessProps {
  order: Order;
}

export function CheckoutSuccess({ order }: CheckoutSuccessProps) {
  return (
    <div className="text-center py-8">
      {/* Success icon */}
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-secondary-500/20 flex items-center justify-center">
        <svg
          className="w-10 h-10 text-secondary-400"
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
      </div>

      {/* Thank you message */}
      <h1 className="font-display text-3xl sm:text-4xl font-semibold text-primary-200 mb-4">
        Thank You!
      </h1>
      <p className="text-neutral-300 text-lg mb-2">
        Your order has been placed successfully.
      </p>
      <p className="text-neutral-500 mb-8">
        Order #{order.orderNumber}
      </p>

      {/* Order details card */}
      <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6 text-left max-w-md mx-auto mb-8">
        <h3 className="font-display text-lg font-semibold text-primary-200 mb-4">
          Order Details
        </h3>

        {/* Shipping address */}
        <div className="mb-4">
          <p className="text-sm text-neutral-500 mb-1">Shipping to:</p>
          <p className="text-neutral-200">
            {order.shipping.firstName} {order.shipping.lastName}
          </p>
          <p className="text-neutral-400 text-sm">
            {order.shipping.address}
            {order.shipping.apartment && `, ${order.shipping.apartment}`}
          </p>
          <p className="text-neutral-400 text-sm">
            {order.shipping.city}, {order.shipping.state} {order.shipping.zipCode}
          </p>
        </div>

        {/* Items */}
        <div className="border-t border-neutral-700/50 pt-4 mb-4">
          <p className="text-sm text-neutral-500 mb-2">Items ordered:</p>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <span className="text-neutral-300">
                  {item.name} x {item.quantity}
                </span>
                <span className="text-neutral-200">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t border-neutral-700/50 pt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span className="text-neutral-300">${order.subtotal.toFixed(2)}</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Shipping</span>
            <span className="text-neutral-300">
              {order.shipping_cost === 0 ? "Free" : `$${order.shipping_cost.toFixed(2)}`}
            </span>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-neutral-700/50">
            <span className="font-semibold text-neutral-200">Total</span>
            <span className="font-bold text-lg text-primary-200">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>

      {/* Email confirmation notice */}
      <p className="text-sm text-neutral-500 mb-8">
        A confirmation email has been sent to{" "}
        <span className="text-neutral-300">{order.shipping.email}</span>
      </p>

      {/* Continue shopping button */}
      <Link
        to="/shop"
        className="inline-flex items-center gap-2 px-8 py-3.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        Continue Shopping
      </Link>
    </div>
  );
}
