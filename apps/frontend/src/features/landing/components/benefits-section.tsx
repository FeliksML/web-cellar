import { SectionTitle } from "./section-title";
import { BenefitItem } from "./benefit-item";
import { benefits } from "../data/landing.data";

export function BenefitsSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <SectionTitle>WHY BEASTY BAKER IS DIFFERENT</SectionTitle>
        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {benefits.map((benefit, index) => (
            <div
              key={benefit.id}
              className={`${
                index < benefits.length - 1
                  ? "lg:border-r lg:border-primary-400/30 lg:pr-10"
                  : ""
              }`}
            >
              <BenefitItem benefit={benefit} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
