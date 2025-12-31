import { SectionTitle } from "./section-title";
import { ProductCard } from "./product-card";
import { products } from "../data/landing.data";

export function ProductLineupSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>PROTEIN TREATS LINEUP</SectionTitle>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
