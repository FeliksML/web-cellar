import { Link } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { heroContent } from "../data/landing.data";
import { FloatingHeroImage } from "./floating-hero-image";

// Hero product data with links
const heroProducts = [
  {
    id: "blueberry",
    src: "/blueberry_lemon_pie.png",
    alt: "Blueberry Lemon Pie with mint",
    name: "Blueberry Lemon",
    subtitle: "Protein Cupcake",
    href: "/shop/blueberry-lemon-protein-cupcake",
    glowVariant: "purple" as const,
    glowColor: "#9B6BFF",
  },
  {
    id: "pistachio",
    src: "/pistachio_strawberry_cupcake.png",
    alt: "Pistachio Strawberry Cupcake with matcha",
    name: "Pistachio Matcha",
    subtitle: "Protein Cupcake",
    href: "/shop/pistachio-matcha-protein-cupcake",
    glowVariant: "default" as const,
    glowColor: "#E1CE71",
  },
];

interface HeroProduct {
  id: string;
  src: string;
  alt: string;
  name: string;
  subtitle: string;
  href: string;
  glowVariant: "purple" | "default";
  glowColor: string;
}

function HeroProductItem({ product }: { product: HeroProduct }) {
  return (
    <Link
      to={product.href}
      className="group relative flex flex-col items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 rounded-2xl"
    >
      {/* Glow - attached to product, responsive sizing */}
      <div
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-56 h-56
          sm:w-64 sm:h-64
          md:w-72 md:h-72
          lg:w-80 lg:h-80
          xl:w-96 xl:h-96
          rounded-full blur-3xl opacity-35
          mix-blend-screen pointer-events-none
          transition-opacity duration-300 group-hover:opacity-50
        "
        style={{ backgroundColor: product.glowColor }}
      />

      {/* Image */}
      <FloatingHeroImage
        src={product.src}
        alt={product.alt}
        glowVariant={product.glowVariant}
        className="
          w-[75vw] max-w-[280px]
          sm:w-[60vw] sm:max-w-[320px]
          md:w-[38vw] md:max-w-[360px]
          lg:w-[40vw] lg:max-w-[420px]
          xl:max-w-[480px]
        "
      />

      {/* Label - clickable product name */}
      <div className="relative z-10 mt-5 text-center transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="font-display text-xl sm:text-2xl font-semibold text-primary-200 group-hover:text-primary-100 transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-sm text-neutral-400 group-hover:text-neutral-300 transition-colors uppercase tracking-wider">
          {product.subtitle}
        </p>

        {/* Hover CTA */}
        <div className="mt-2 h-5 overflow-hidden">
          <span className="inline-flex items-center gap-1.5 text-xs text-primary-400 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-200">
            Shop Now
            <svg
              className="w-3 h-3"
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
          </span>
        </div>
      </div>
    </Link>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-10 md:pt-14 pb-16 md:pb-20 overflow-hidden">
      {/* Content container */}
      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Text content - always at top */}
        <div className="text-center space-y-4">
          <h1 className="font-display font-semibold tracking-tight text-primary-200 text-4xl sm:text-5xl lg:text-6xl leading-tight drop-shadow">
            {heroContent.headline}
          </h1>
          <p className="font-sans text-base sm:text-lg text-neutral-200">
            {heroContent.subline}
          </p>
          <div className="pt-4 flex justify-center">
            <Link to="/shop">
              <OutlinePillButton size="md">
                {heroContent.ctaText}
              </OutlinePillButton>
            </Link>
          </div>
        </div>

        {/* Product visuals - below text */}
        <div className="relative mt-10 md:mt-14">
          {/* Products grid - glow is now inside each product item */}
          <div className="relative z-10 flex flex-col items-center gap-12 md:flex-row md:justify-center md:gap-10 lg:gap-16">
            {heroProducts.map((product) => (
              <HeroProductItem key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
