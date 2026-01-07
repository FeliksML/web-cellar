import { Link } from "react-router-dom";
import type { Product } from "../types";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  // Generate slug from product id
  const slug = product.id.replace(/_/g, "-");

  return (
    <Link
      to={`/shop/${slug}`}
      className="group cursor-pointer text-center transition-all duration-300 hover:-translate-y-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950 rounded-2xl block"
    >
      {/* Product image card with gradient background */}
      <div
        className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden shadow-xl shadow-black/20 group-hover:shadow-2xl group-hover:shadow-black/30 transition-shadow duration-300"
        style={{
          background: `linear-gradient(145deg, ${product.gradientFrom}20, ${product.gradientTo}30)`,
        }}
      >
        {/* Gradient overlay */}
        <div
          className="absolute inset-0 opacity-60"
          style={{
            background: `radial-gradient(circle at 50% 60%, ${product.gradientFrom}40, transparent 70%)`,
          }}
        />

        {/* Placeholder treat icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-20 h-24 sm:w-24 sm:h-28 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
            <svg className="w-10 h-10 text-white/40" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C8.5 2 5.7 4.5 5.2 8H4C2.9 8 2 8.9 2 10V12C2 13.1 2.9 14 4 14H5.2C5.7 17.5 8.5 20 12 20S18.3 17.5 18.8 14H20C21.1 14 22 13.1 22 12V10C22 8.9 21.1 8 20 8H18.8C18.3 4.5 15.5 2 12 2ZM12 4C14.4 4 16.4 5.8 16.8 8H7.2C7.6 5.8 9.6 4 12 4ZM12 18C9.6 18 7.6 16.2 7.2 14H16.8C16.4 16.2 14.4 18 12 18Z" />
            </svg>
          </div>
        </div>

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      {/* Product name with Playfair Display */}
      <h3 className="mt-5 font-display text-lg sm:text-xl font-semibold text-primary-300 group-hover:text-primary-200 whitespace-pre-line transition-colors duration-300">
        {product.name}
      </h3>

      {/* Product meta */}
      <p className="mt-2 text-xs sm:text-sm leading-relaxed text-neutral-400 group-hover:text-neutral-300 whitespace-pre-line transition-colors duration-300">
        {product.meta}
      </p>
    </Link>
  );
}
