import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <button
      type="button"
      className="group cursor-pointer text-center transition hover:-translate-y-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-lg"
    >
      {/* Product image placeholder with gradient */}
      <div
        className="mx-auto w-full max-w-xs aspect-square rounded-2xl drop-shadow-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${product.gradientFrom}, ${product.gradientTo})`,
        }}
      >
        {/* Placeholder treat shape */}
        <div className="w-full h-full flex items-center justify-center">
          <div className="w-24 h-28 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
            <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
              Treat
            </span>
          </div>
        </div>
      </div>

      {/* Product name */}
      <h3 className="mt-6 text-lg font-semibold text-primary-200 group-hover:text-primary-300 whitespace-pre-line">
        {product.name}
      </h3>

      {/* Product meta */}
      <p className="mt-2 text-sm leading-relaxed text-neutral-300 whitespace-pre-line">
        {product.meta}
      </p>
    </button>
  );
}
