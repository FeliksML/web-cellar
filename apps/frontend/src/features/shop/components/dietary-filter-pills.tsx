/**
 * Dietary filter pills for quick filtering
 */

import { useFilterStore } from "../stores/filter-store";

interface DietaryFilter {
  key: "isGlutenFree" | "isDairyFree" | "isVegan" | "isKetoFriendly";
  label: string;
  shortLabel: string;
}

const DIETARY_FILTERS: DietaryFilter[] = [
  { key: "isGlutenFree", label: "Gluten-Free", shortLabel: "GF" },
  { key: "isDairyFree", label: "Dairy-Free", shortLabel: "DF" },
  { key: "isVegan", label: "Vegan", shortLabel: "V" },
  { key: "isKetoFriendly", label: "Keto", shortLabel: "K" },
];

export function DietaryFilterPills() {
  const store = useFilterStore();

  // Map store keys to filter keys
  const filterValues: Record<DietaryFilter["key"], boolean> = {
    isGlutenFree: store.isGlutenFree ?? false,
    isDairyFree: store.isDairyFree ?? false,
    isVegan: store.isVegan ?? false,
    isKetoFriendly: store.isKetoFriendly ?? false,
  };

  const toggleFilter = (key: DietaryFilter["key"]) => {
    const currentValue = filterValues[key];
    switch (key) {
      case "isGlutenFree":
        store.setGlutenFree(!currentValue ? true : undefined);
        break;
      case "isDairyFree":
        store.setDairyFree(!currentValue ? true : undefined);
        break;
      case "isVegan":
        store.setVegan(!currentValue ? true : undefined);
        break;
      case "isKetoFriendly":
        store.setKetoFriendly(!currentValue ? true : undefined);
        break;
    }
  };

  const activeCount = Object.values(filterValues).filter(Boolean).length;

  return (
    <div className="flex flex-wrap items-center gap-2 justify-center">
      <span className="text-xs text-neutral-400 uppercase tracking-wider mr-1">
        Dietary:
      </span>
      {DIETARY_FILTERS.map((filter) => {
        const isActive = filterValues[filter.key];
        return (
          <button
            key={filter.key}
            onClick={() => toggleFilter(filter.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 ${
              isActive
                ? "bg-secondary-500/20 text-secondary-400 border-2 border-secondary-500/50"
                : "bg-neutral-800/40 text-neutral-400 border-2 border-neutral-700/30 hover:border-neutral-600/50 hover:text-neutral-300"
            }`}
          >
            {isActive && (
              <svg
                className="w-3 h-3"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={3}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {filter.label}
          </button>
        );
      })}
      {activeCount > 0 && (
        <button
          onClick={() => {
            store.setGlutenFree(undefined);
            store.setDairyFree(undefined);
            store.setVegan(undefined);
            store.setKetoFriendly(undefined);
          }}
          className="px-2 py-1 text-xs text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          Clear
        </button>
      )}
    </div>
  );
}
