import { freshnessContent } from "../data/landing.data";

export function FreshnessSection() {
  return (
    <section className="py-12 sm:py-16 md:py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 max-w-4xl mx-auto">
          {/* Elegant italic headline with Playfair Display */}
          <h2
            className="font-display italic text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] text-primary-400 leading-snug"
            style={{ textShadow: '0 2px 16px rgba(236, 180, 94, 0.25)' }}
          >
            {freshnessContent.headline}
          </h2>
          <p className="text-sm sm:text-base md:text-lg text-neutral-400 max-w-2xl mx-auto">
            {freshnessContent.body}
          </p>
        </div>
      </div>
    </section>
  );
}
