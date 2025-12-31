import {
  LandingNavbar,
  HeroSection,
  FreshnessSection,
  BenefitsSection,
  ProductLineupSection,
} from "@/features/landing";

export function HomePage() {
  return (
    <div
      className="min-h-screen text-neutral-100 bg-cover bg-center bg-fixed bg-no-repeat"
      style={{
        backgroundImage: "url('/background.png')",
      }}
    >
      <LandingNavbar />
      <main>
        <HeroSection />
        <FreshnessSection />
        <BenefitsSection />
        <ProductLineupSection />
      </main>
    </div>
  );
}
