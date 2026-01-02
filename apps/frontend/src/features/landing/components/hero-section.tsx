import { Link } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { heroContent } from "../data/landing.data";
import { FloatingHeroImage } from "./floating-hero-image";

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
              <OutlinePillButton size="md">{heroContent.ctaText}</OutlinePillButton>
            </Link>
          </div>
        </div>

        {/* Product visuals - below text */}
        <div className="relative mt-10 md:mt-14">
          {/* Left purple glow */}
          <div
            className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-40 mix-blend-screen pointer-events-none"
            style={{ backgroundColor: "#9B6BFF" }}
          />

          {/* Right green-gold glow */}
          <div
            className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-80 h-80 md:w-96 md:h-96 rounded-full blur-3xl opacity-40 mix-blend-screen pointer-events-none"
            style={{ backgroundColor: "#E1CE71" }}
          />

          {/* Products grid */}
          <div className="relative z-10 flex flex-col items-center gap-8 md:flex-row md:justify-center md:gap-10 lg:gap-16">
            {/* Left product - Blueberry Lemon Pie */}
            <div className="relative flex items-center justify-center">
              <FloatingHeroImage
                src="/blueberry_lemon_pie.png"
                alt="Blueberry Lemon Pie with mint"
                glowVariant="purple"
                className="
                  w-[80vw] max-w-[320px]
                  sm:w-[60vw] sm:max-w-[360px]
                  md:w-[40vw] md:max-w-[400px]
                  lg:w-[45vw] lg:max-w-[480px]
                  xl:max-w-[520px]
                  mx-auto md:mx-0
                "
              />
            </div>

            {/* Right product - Pistachio Strawberry Cupcake */}
            <div className="relative flex items-center justify-center">
              <FloatingHeroImage
                src="/pistachio_strawberry_cupcake.png"
                alt="Pistachio Strawberry Cupcake with matcha"
                glowVariant="default"
                className="
                  w-[80vw] max-w-[320px]
                  sm:w-[60vw] sm:max-w-[360px]
                  md:w-[40vw] md:max-w-[400px]
                  lg:w-[45vw] lg:max-w-[480px]
                  xl:max-w-[520px]
                  mx-auto md:mx-0
                "
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
