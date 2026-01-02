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
      {/* Glow - attached to product, extra large */}
      <div
        className="
          absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
          w-72 h-72
          sm:w-80 sm:h-80
          md:w-96 md:h-96
          lg:w-[26rem] lg:h-[26rem]
          xl:w-[32rem] xl:h-[32rem]
          rounded-full blur-3xl opacity-45
          mix-blend-screen pointer-events-none
          transition-opacity duration-300 group-hover:opacity-60
        "
        style={{ backgroundColor: product.glowColor }}
      />

      {/* Image - EXTRA LARGE hero sizes */}
      <FloatingHeroImage
        src={product.src}
        alt={product.alt}
        glowVariant={product.glowVariant}
        className="
          w-[44vw] max-w-[320px]
          sm:w-[42vw] sm:max-w-[380px]
          md:w-[38vw] md:max-w-[440px]
          lg:w-[36vw] lg:max-w-[520px]
          xl:max-w-[580px]
        "
      />

      {/* Product name label */}
      <div className="relative z-10 mt-3 text-center transition-transform duration-300 group-hover:-translate-y-1">
        <h3 className="font-display text-base sm:text-lg font-semibold text-primary-200 group-hover:text-primary-100 transition-colors">
          {product.name}
        </h3>
        <p className="text-xs text-neutral-300 group-hover:text-neutral-200 transition-colors uppercase tracking-wider">
          {product.subtitle}
        </p>
      </div>
    </Link>
  );
}

export function HeroSection() {
  return (
    <section className="relative pt-4 sm:pt-6 md:pt-8 pb-4 sm:pb-6 overflow-hidden">
      {/* Content container */}
      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">

        {/* 1. HEADLINE - top */}
        <h1 className="text-center font-display font-semibold tracking-tight text-primary-400 text-3xl sm:text-4xl lg:text-5xl xl:text-6xl leading-tight drop-shadow-lg" style={{ textShadow: '0 2px 20px rgba(236, 180, 94, 0.4)' }}>
          {heroContent.headline}
        </h1>

        {/* 2. PRODUCTS - middle, bigger */}
        <div className="relative mt-4 sm:mt-6">
          <div className="relative z-10 flex flex-row items-start justify-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
            {heroProducts.map((product) => (
              <HeroProductItem key={product.id} product={product} />
            ))}
          </div>
        </div>

        {/* 3. SUBLINE - below products, colorful */}
        <p className="mt-4 sm:mt-6 text-center font-sans text-sm sm:text-base lg:text-lg text-primary-400 font-medium">
          {heroContent.subline}
        </p>

        {/* 4. CTA - bottom */}
        <div className="mt-4 sm:mt-5 flex justify-center">
          <Link to="/shop">
            <OutlinePillButton size="md">
              {heroContent.ctaText}
            </OutlinePillButton>
          </Link>
        </div>
      </div>
    </section>
  );
}
