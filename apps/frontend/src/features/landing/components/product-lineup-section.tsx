import { Link } from "react-router-dom";
import { SectionTitle } from "./section-title";
import { ProductCard } from "./product-card";
import { products as fallbackProducts } from "../data/landing.data";
import { useFeaturedProducts } from "@/features/shop";
import type { Product } from "../types";

export function ProductLineupSection() {
  const { data: featuredProducts, isLoading } = useFeaturedProducts(4);

  // Map API products to landing page format, or use fallback
  const products: Product[] =
    featuredProducts && featuredProducts.length > 0
      ? featuredProducts.map((p) => ({
          id: String(p.id),
          name: p.name,
          meta: `Up to ${p.protein_grams || 25}g Protein \u00b7 ${p.is_gluten_free ? "Gluten-Free" : ""}\nNo Preservatives \u00b7 Real Ingredients.`,
          gradientFrom: p.gradient_from || "#6366F1",
          gradientTo: p.gradient_to || "#8B5CF6",
        }))
      : fallbackProducts;

  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>PROTEIN TREATS LINEUP</SectionTitle>

        {isLoading ? (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-square rounded-2xl bg-neutral-800" />
                <div className="mt-6 space-y-2">
                  <div className="h-5 bg-neutral-800 rounded w-3/4 mx-auto" />
                  <div className="h-4 bg-neutral-800 rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

        {/* Shop All Button */}
        <div className="mt-12 text-center">
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-primary-500 hover:bg-primary-600 text-neutral-950 font-semibold rounded-full transition shadow-lg shadow-primary-500/25"
          >
            Shop All Products
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
                d="M17 8l4 4m0 0l-4 4m4-4H3"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
