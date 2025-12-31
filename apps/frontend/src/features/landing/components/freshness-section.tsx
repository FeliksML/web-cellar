import { freshnessContent } from "../data/landing.data";

export function FreshnessSection() {
  return (
    <section className="py-16 md:py-20">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-3 max-w-3xl mx-auto">
          <h2 className="font-display text-2xl sm:text-3xl text-primary-200">
            {freshnessContent.headline}
          </h2>
          <p className="text-sm sm:text-base text-neutral-300">
            {freshnessContent.body}
          </p>
        </div>
      </div>
    </section>
  );
}
