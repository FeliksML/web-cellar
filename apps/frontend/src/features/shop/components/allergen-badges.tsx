/**
 * Allergen badges component
 * Displays allergen warnings for products
 */

import { AlertTriangle } from "lucide-react";

// Common allergens with their display names
const allergenLabels: Record<string, string> = {
  milk: "Milk",
  eggs: "Eggs",
  wheat: "Wheat",
  soy: "Soy",
  nuts: "Tree Nuts",
  peanuts: "Peanuts",
  fish: "Fish",
  shellfish: "Shellfish",
  sesame: "Sesame",
};

interface AllergenBadgesProps {
  allergens: string[] | null;
  variant?: "compact" | "full";
  showIcon?: boolean;
}

export function AllergenBadges({
  allergens,
  variant = "compact",
  showIcon = true,
}: AllergenBadgesProps) {
  if (!allergens || allergens.length === 0) return null;

  const getAllergenLabel = (allergen: string): string => {
    return allergenLabels[allergen.toLowerCase()] || allergen;
  };

  if (variant === "compact") {
    return (
      <div className="flex items-center gap-1.5 text-amber-400">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />}
        <span className="text-xs font-medium">
          Contains: {allergens.map(getAllergenLabel).join(", ")}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-amber-400">
        {showIcon && <AlertTriangle className="w-4 h-4" />}
        <span className="text-sm font-semibold">Allergen Information</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {allergens.map((allergen) => (
          <span
            key={allergen}
            className="text-xs px-2.5 py-1 bg-amber-500/20 text-amber-300 rounded-full font-medium border border-amber-500/30"
          >
            {getAllergenLabel(allergen)}
          </span>
        ))}
      </div>
    </div>
  );
}

/**
 * Simple inline allergen warning
 */
export function AllergenWarning({
  allergens,
}: {
  allergens: string[] | null;
}) {
  if (!allergens || allergens.length === 0) return null;

  return (
    <p className="text-xs text-amber-400/80 italic">
      May contain: {allergens.join(", ")}
    </p>
  );
}
