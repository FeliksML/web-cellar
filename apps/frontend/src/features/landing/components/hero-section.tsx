import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { heroContent } from "../data/landing.data";

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
            <OutlinePillButton size="md">{heroContent.ctaText}</OutlinePillButton>
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
            {/* Left product - Blueberry Lemon */}
            <div className="relative">
              <div
                className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl drop-shadow-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #6366F1, #8B5CF6)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-32 h-40 mx-auto rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                        Blueberry
                        <br />
                        Lemon
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right product - Pistachio Matcha */}
            <div className="relative">
              <div
                className="w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-2xl drop-shadow-xl overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, #39C78B, #E1CE71)",
                }}
              >
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-6">
                    <div className="w-32 h-40 mx-auto rounded-xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                      <span className="text-white/60 text-xs font-medium uppercase tracking-wider">
                        Pistachio
                        <br />
                        Matcha
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
