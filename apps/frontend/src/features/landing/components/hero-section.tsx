import { Link } from "react-router-dom";
import { heroContent, featureBadges, featureSubtext } from "../data/landing.data";

export function HeroSection() {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Background image with products */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: 'url(/hero_strawberry_bluberry.png)' }}
      />

      {/* Text content - positioned in upper portion */}
      <div className="relative z-10 flex flex-col items-center justify-start min-h-screen px-8 pt-24 sm:pt-28 md:pt-32 text-center">

        {/* 1. HERO TITLE */}
        <h1 className="font-display font-semibold text-shadow-hero" style={{ color: "#FDFDEF" }}>
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
        <div className="mt-6">
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

        {/* 3. CTA BUTTON */}
        <div className="mt-8">
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

        {/* 4. SUPPORTING TEXT */}
        <div className="mt-10">
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
