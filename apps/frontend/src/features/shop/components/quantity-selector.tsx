/**
 * Quantity selector component
 * Supports bakery-specific minimum quantities and quantity increments
 */

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  increment?: number;
  disabled?: boolean;
  showLabel?: boolean;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  increment = 1,
  disabled = false,
  showLabel = false,
}: QuantitySelectorProps) {
  const decrease = () => {
    const newQuantity = quantity - increment;
    if (newQuantity >= min) {
      onChange(newQuantity);
    }
  };

  const increase = () => {
    const newQuantity = quantity + increment;
    if (newQuantity <= max) {
      onChange(newQuantity);
    }
  };

  // Show helper text for non-standard increments
  const showIncrementHint = increment > 1 && showLabel;

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={decrease}
        disabled={disabled || quantity <= min}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Decrease quantity"
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
            d="M20 12H4"
          />
        </svg>
      </button>

      <span className="w-12 text-center text-neutral-100 font-medium">
        {quantity}
      </span>

      <button
        type="button"
        onClick={increase}
        disabled={disabled || quantity >= max}
        className="w-8 h-8 flex items-center justify-center rounded-full bg-neutral-800 text-neutral-200 hover:bg-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
        aria-label="Increase quantity"
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
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {showIncrementHint && (
        <span className="text-xs text-foreground/50 ml-1">
          (sold in {increment}s)
        </span>
      )}
    </div>
  );
}

/**
 * Bakery quantity selector with product constraints
 */
interface BakeryQuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  minimumQuantity: number;
  quantityIncrement: number;
  maxQuantity?: number;
  disabled?: boolean;
}

export function BakeryQuantitySelector({
  quantity,
  onChange,
  minimumQuantity,
  quantityIncrement,
  maxQuantity = 99,
  disabled = false,
}: BakeryQuantitySelectorProps) {
  return (
    <div className="space-y-1">
      <QuantitySelector
        quantity={quantity}
        onChange={onChange}
        min={minimumQuantity}
        max={maxQuantity}
        increment={quantityIncrement}
        disabled={disabled}
      />
      {(minimumQuantity > 1 || quantityIncrement > 1) && (
        <p className="text-xs text-foreground/50">
          {minimumQuantity > 1 && `Min: ${minimumQuantity}`}
          {minimumQuantity > 1 && quantityIncrement > 1 && " · "}
          {quantityIncrement > 1 && `Sold in ${quantityIncrement}s`}
        </p>
      )}
    </div>
  );
}
