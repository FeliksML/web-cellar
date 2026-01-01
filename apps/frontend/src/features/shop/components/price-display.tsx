/**
 * Price display component
 */

interface PriceDisplayProps {
  price: number;
  compareAtPrice?: number | null;
  size?: "sm" | "md" | "lg";
}

export function PriceDisplay({
  price,
  compareAtPrice,
  size = "md",
}: PriceDisplayProps) {
  const isOnSale = compareAtPrice && compareAtPrice > price;

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const sizeClasses = {
    sm: {
      current: "text-sm font-semibold",
      compare: "text-xs",
    },
    md: {
      current: "text-lg font-bold",
      compare: "text-sm",
    },
    lg: {
      current: "text-2xl font-bold",
      compare: "text-base",
    },
  };

  return (
    <div className="flex items-center justify-center gap-2">
      <span
        className={`${sizeClasses[size].current} ${isOnSale ? "text-red-400" : "text-primary-300"}`}
      >
        {formatPrice(price)}
      </span>
      {isOnSale && compareAtPrice && (
        <span
          className={`${sizeClasses[size].compare} text-neutral-500 line-through`}
        >
          {formatPrice(compareAtPrice)}
        </span>
      )}
    </div>
  );
}

/**
 * Savings badge for sale items
 */
export function SavingsBadge({
  price,
  compareAtPrice,
}: {
  price: number;
  compareAtPrice: number;
}) {
  const savings = compareAtPrice - price;
  const percentOff = Math.round((savings / compareAtPrice) * 100);

  return (
    <span className="text-xs font-semibold text-red-400 bg-red-500/10 px-2 py-1 rounded-full">
      Save {percentOff}%
    </span>
  );
}
