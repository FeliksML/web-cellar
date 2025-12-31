import {
  LandingNavbar,
  HeroSection,
  FreshnessSection,
  BenefitsSection,
  ProductLineupSection,
} from "@/features/landing";
import { useTheme } from "@/hooks/use-theme";

export function HomePage() {
  // Initialize theme on mount
  useTheme();

  return (
    <div
      className="min-h-screen bg-neutral-50 text-neutral-900 dark:text-neutral-100 bg-cover bg-center bg-fixed bg-no-repeat"
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
