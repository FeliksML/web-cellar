import { Link } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { heroContent } from "../data/landing.data";

export function HeroSection() {
  return (
    <section className="relative pt-6 sm:pt-8 md:pt-12 pb-8 sm:pb-12 overflow-hidden hero-purple-gradient">
      {/* Content container */}
      <div className="relative z-10 mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">

        {/* 1. HEADLINE - Playfair Display serif font */}
        <h1
          className="text-center font-display font-semibold tracking-tight text-primary-400 text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl leading-tight"
          style={{ textShadow: '0 2px 24px rgba(236, 180, 94, 0.35)' }}
        >
          {heroContent.headline}
        </h1>

        {/* 2. SUBLINE - with bullet separators */}
        <p className="mt-3 sm:mt-4 text-center font-sans text-sm sm:text-base lg:text-lg text-neutral-300 tracking-wide">
          {heroContent.subline}
        </p>

        {/* 3. CTA - above hero image */}
        <div className="mt-5 sm:mt-6 flex justify-center">
          <Link to="/shop">
            <OutlinePillButton size="md">
              {heroContent.ctaText}
            </OutlinePillButton>
          </Link>
        </div>

        {/* 4. SINGLE HERO PRODUCT - Blueberry Pie centerpiece */}
        <div className="relative mt-6 sm:mt-8 flex justify-center">
          {/* Purple glow behind the product */}
          <div
            className="
              absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-[80vw] h-[80vw]
              max-w-[500px] max-h-[500px]
              sm:max-w-[600px] sm:max-h-[600px]
              md:max-w-[700px] md:max-h-[700px]
              lg:max-w-[800px] lg:max-h-[800px]
              rounded-full blur-3xl opacity-30
              pointer-events-none
            "
            style={{ backgroundColor: '#9B6BFF' }}
          />

          {/* Hero product image - large and centered */}
          <Link
            to="/shop/blueberry-lemon-protein-cupcake"
            className="group relative block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:ring-offset-4 focus-visible:ring-offset-neutral-950 rounded-2xl"
          >
            <img
              src="/BP_FINAL.png"
              alt="Blueberry Lemon Protein Treat - Our signature handcrafted dessert"
              className="
                relative z-10
                w-[85vw] max-w-[380px]
                sm:w-[75vw] sm:max-w-[480px]
                md:w-[65vw] md:max-w-[560px]
                lg:max-w-[640px]
                xl:max-w-[720px]
                h-auto
                object-contain
                animate-float-gentle
                transition-transform duration-500 ease-out
                group-hover:scale-[1.02]
              "
            />

            {/* Product label on hover */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 text-center">
              <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900/80 backdrop-blur-sm rounded-full text-sm text-primary-300 border border-primary-500/30">
                View Product →
              </span>
            </div>
          </Link>
        </div>

        {/* Product name label */}
        <div className="mt-6 sm:mt-8 text-center">
          <h2 className="font-display text-xl sm:text-2xl md:text-3xl font-semibold text-primary-200">
            Blueberry Lemon
          </h2>
          <p className="mt-1 text-sm sm:text-base text-neutral-400 uppercase tracking-widest">
            Protein Cupcake
          </p>
        </div>
      </div>
    </section>
  );
}
