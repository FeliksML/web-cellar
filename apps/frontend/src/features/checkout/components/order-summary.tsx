/**
 * Order summary sidebar component
 */

import { useCartStore, useCartSummary } from "@/features/shop/stores/cart-store";

interface OrderSummaryProps {
  showEditButton?: boolean;
  onEdit?: () => void;
}

export function OrderSummary({ showEditButton = true, onEdit }: OrderSummaryProps) {
  const items = useCartStore((state) => state.items);
  const { subtotal } = useCartSummary();

  // Mock shipping cost (free over $50)
  const shippingCost = subtotal >= 50 ? 0 : 5.99;
  const total = subtotal + shippingCost;

  return (
    <div className="bg-neutral-800/40 backdrop-blur-sm rounded-2xl border border-neutral-700/50 p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-primary-200">
          Order Summary
        </h3>
        {showEditButton && onEdit && (
          <button
            onClick={onEdit}
            className="text-sm text-primary-400 hover:text-primary-300 transition-colors"
          >
            Edit
          </button>
        )}
      </div>

      {/* Items */}
      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.product.id} className="flex gap-3">
            {/* Thumbnail */}
            <div className="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
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
                  <span className="text-white/60 text-[10px] font-medium uppercase">
                    Treat
                  </span>
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-neutral-200 truncate">
                {item.product.name}
              </h4>
              <p className="text-xs text-neutral-500">
                Qty: {item.quantity}
              </p>
            </div>

            {/* Price */}
            <div className="text-sm font-medium text-neutral-200">
              ${(item.product.price * item.quantity).toFixed(2)}
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="border-t border-neutral-700/50 pt-4 space-y-3">
        {/* Subtotal */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Subtotal</span>
          <span className="text-neutral-200">${subtotal.toFixed(2)}</span>
        </div>

        {/* Shipping */}
        <div className="flex items-center justify-between text-sm">
          <span className="text-neutral-400">Shipping</span>
          <span className="text-neutral-200">
            {shippingCost === 0 ? (
              <span className="text-secondary-400">Free</span>
            ) : (
              `$${shippingCost.toFixed(2)}`
            )}
          </span>
        </div>

        {/* Free shipping progress */}
        {subtotal < 50 && (
          <div className="pt-2">
            <p className="text-xs text-neutral-500 mb-2">
              ${(50 - subtotal).toFixed(2)} away from free shipping
            </p>
            <div className="h-1.5 bg-neutral-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary-500 rounded-full transition-all duration-300"
                style={{ width: `${Math.min((subtotal / 50) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Total */}
      <div className="border-t border-neutral-700/50 mt-4 pt-4">
        <div className="flex items-center justify-between">
          <span className="text-lg font-semibold text-neutral-200">Total</span>
          <span className="text-2xl font-bold text-primary-200">
            ${total.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
}
