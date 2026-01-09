import { Link } from "react-router-dom";
import { heroContent, featureBadges, featureSubtext } from "../data/landing.data";

export function HeroSection() {
  return (
    <section className="relative pt-6 pb-8 overflow-hidden">
      {/* Content container */}
      <div className="relative z-10 mx-auto w-full max-w-md px-8">

        {/* 1. HERO TITLE */}
        <h1 className="text-center font-display font-semibold text-shadow-hero" style={{ color: "#FDFDEF" }}>
          <span
            className="block"
            style={{
              fontSize: "clamp(36px, 11vw, 44px)",
              lineHeight: "1.05",
              letterSpacing: "-0.6px"
            }}
          >
            {heroContent.heroLine1}
          </span>
          <span
            className="block"
            style={{
              fontSize: "clamp(36px, 11vw, 44px)",
              lineHeight: "1.05",
              letterSpacing: "-0.6px"
            }}
          >
            {heroContent.heroLine2}
          </span>
        </h1>

        {/* 2. FEATURE BADGES */}
        <div className="mt-6 text-center">
          {/* Main badges row */}
          <div className="flex items-center justify-center gap-2 flex-wrap">
            {featureBadges.map((badge, index) => (
              <span key={badge.text} className="flex items-center">
                <span
                  className="font-sans font-bold uppercase tracking-wider"
                  style={{
                    color: badge.color,
                    fontSize: "12px",
                    lineHeight: "14px",
                    letterSpacing: "0.9px"
                  }}
                >
                  {badge.text}
                </span>
                {index < featureBadges.length - 1 && (
                  <span className="mx-2 text-neutral-600" style={{ fontSize: "12px" }}>
                    •
                  </span>
                )}
              </span>
            ))}
          </div>
          {/* Subtext */}
          <p
            className="mt-1.5 font-sans font-bold uppercase tracking-wider"
            style={{
              color: featureSubtext.color,
              fontSize: "12px",
              lineHeight: "14px",
              letterSpacing: "0.9px"
            }}
          >
            {featureSubtext.text}
          </p>
        </div>

        {/* 3. HERO IMAGE - Two muffins */}
        <div className="relative mt-6 flex justify-center items-end h-[220px] sm:h-[260px] md:h-[300px]">
          {/* Blueberry muffin - left */}
          <img
            src="/bluberry_pie.png"
            alt="Blueberry protein muffin"
            className="absolute left-0 bottom-0 w-[55%] max-w-[180px] sm:max-w-[200px] h-auto object-contain animate-float-gentle z-10"
            style={{ animationDelay: "0s" }}
          />
          {/* Matcha/Pistachio muffin - right */}
          <img
            src="/final_strawberry_matcha.png"
            alt="Pistachio matcha protein muffin"
            className="absolute right-0 bottom-0 w-[55%] max-w-[180px] sm:max-w-[200px] h-auto object-contain animate-float-gentle"
            style={{ animationDelay: "0.5s" }}
          />
        </div>

        {/* 4. CTA BUTTON */}
        <div className="mt-8 flex justify-center">
          <Link
            to="/shop"
            className="btn-gold inline-flex items-center justify-center px-10 py-3 rounded-[10px] font-sans font-extrabold uppercase tracking-wider"
            style={{
              fontSize: "16px",
              lineHeight: "16px",
              letterSpacing: "0.8px",
              color: "#141414"
            }}
          >
            {heroContent.ctaText}
          </Link>
        </div>

        {/* 5. SUPPORTING TEXT */}
        <div className="mt-10 text-center">
          <p
            className="font-sans font-medium"
            style={{
              color: "#F1F1F1",
              fontSize: "18px",
              lineHeight: "24px"
            }}
          >
            {heroContent.support1}
          </p>
          <p
            className="font-sans font-medium"
            style={{
              color: "#F1F1F1",
              fontSize: "18px",
              lineHeight: "24px"
            }}
          >
            {heroContent.support2}
          </p>
        </div>

      </div>
    </section>
  );
}
