import {
  LandingNavbar,
  HeroSection,
  FreshnessSection,
  BenefitsSection,
  ProductLineupSection,
  BottomTabBar,
} from "@/features/landing";

export function HomePage() {
  return (
    <div className="min-h-screen text-neutral-100 landing-bg-gradient relative landing-vignette">
      <LandingNavbar />
      <main className="pb-20 md:pb-0">
        <HeroSection />
        <FreshnessSection />
        <BenefitsSection />
        <ProductLineupSection />
      </main>
      <BottomTabBar />
    </div>
  );
}
