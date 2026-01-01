/**
 * Dietary badges component
 */

import type { ProductListItem } from "../types";

interface DietaryBadgesProps {
  product: Pick<
    ProductListItem,
    "is_gluten_free" | "is_dairy_free" | "is_vegan" | "is_keto_friendly"
  >;
  size?: "sm" | "md";
}

const badges = [
  { key: "is_gluten_free" as const, label: "GF", fullLabel: "Gluten-Free" },
  { key: "is_dairy_free" as const, label: "DF", fullLabel: "Dairy-Free" },
  { key: "is_vegan" as const, label: "V", fullLabel: "Vegan" },
  { key: "is_keto_friendly" as const, label: "K", fullLabel: "Keto" },
];

export function DietaryBadges({ product, size = "md" }: DietaryBadgesProps) {
  const activeBadges = badges.filter(
    (badge) => product[badge.key as keyof typeof product]
  );

  if (activeBadges.length === 0) return null;

  const sizeClasses = {
    sm: "text-[10px] px-1.5 py-0.5",
    md: "text-xs px-2 py-1",
  };

  return (
    <div className="flex flex-wrap gap-1 justify-center">
      {activeBadges.map((badge) => (
        <span
          key={badge.key}
          className={`${sizeClasses[size]} bg-secondary-500/20 text-secondary-400 rounded-full font-medium`}
          title={badge.fullLabel}
        >
          {badge.label}
        </span>
      ))}
    </div>
  );
}

/**
 * Full dietary badges with labels
 */
export function DietaryBadgesFull({
  product,
}: {
  product: DietaryBadgesProps["product"];
}) {
  const activeBadges = badges.filter(
    (badge) => product[badge.key as keyof typeof product]
  );

  if (activeBadges.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-2">
      {activeBadges.map((badge) => (
        <span
          key={badge.key}
          className="text-xs px-3 py-1 bg-secondary-500/20 text-secondary-400 rounded-full font-medium"
        >
          {badge.fullLabel}
        </span>
      ))}
    </div>
  );
}
