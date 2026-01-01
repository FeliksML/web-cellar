/**
 * Quantity selector component
 */

interface QuantitySelectorProps {
  quantity: number;
  onChange: (quantity: number) => void;
  min?: number;
  max?: number;
  disabled?: boolean;
}

export function QuantitySelector({
  quantity,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
}: QuantitySelectorProps) {
  const decrease = () => {
    if (quantity > min) {
      onChange(quantity - 1);
    }
  };

  const increase = () => {
    if (quantity < max) {
      onChange(quantity + 1);
    }
  };

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
    </div>
  );
}
