/**
 * Category pills for filtering products
 */

import { useCategories } from "../api/get-categories";
import { useFilterStore } from "../stores/filter-store";

export function CategoryPills() {
  const { category, setCategory } = useFilterStore();
  const { data: categories, isLoading } = useCategories();

  if (isLoading) {
    return (
      <div className="flex gap-3 justify-center">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-11 w-28 bg-neutral-800/40 backdrop-blur-sm rounded-full border border-neutral-700/30 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const pillBaseStyles =
    "px-6 py-2.5 rounded-full text-sm font-medium uppercase tracking-wider transition-all duration-200 backdrop-blur-sm";

  const pillActiveStyles =
    "bg-primary-500 text-neutral-950 shadow-lg shadow-primary-500/25 border-2 border-primary-400";

  const pillInactiveStyles =
    "bg-neutral-800/40 text-neutral-300 border-2 border-neutral-700/50 hover:border-primary-400/50 hover:text-primary-200 hover:bg-neutral-800/60";

  return (
    <div className="flex flex-wrap gap-3 justify-center">
      <button
        onClick={() => setCategory(null)}
        className={`${pillBaseStyles} ${
          category === null ? pillActiveStyles : pillInactiveStyles
        }`}
      >
        All
      </button>
      {categories?.map((cat) => (
        <button
          key={cat.slug}
          onClick={() => setCategory(cat.slug)}
          className={`${pillBaseStyles} ${
            category === cat.slug ? pillActiveStyles : pillInactiveStyles
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
}
