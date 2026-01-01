/**
 * Product sort dropdown
 */

import { useFilterStore } from "../stores/filter-store";

const sortOptions = [
  { value: "display_order:asc", label: "Featured" },
  { value: "name:asc", label: "Name: A-Z" },
  { value: "name:desc", label: "Name: Z-A" },
  { value: "price:asc", label: "Price: Low to High" },
  { value: "price:desc", label: "Price: High to Low" },
  { value: "created_at:desc", label: "Newest" },
];

export function ProductSort() {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFilterStore();

  const currentValue = `${sortBy}:${sortOrder}`;

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const [newSortBy, newSortOrder] = e.target.value.split(":") as [
      typeof sortBy,
      typeof sortOrder,
    ];
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
  };

  return (
    <div className="flex items-center gap-3">
      <label htmlFor="sort" className="text-sm text-neutral-400 uppercase tracking-wider">
        Sort
      </label>
      <div className="relative">
        <select
          id="sort"
          value={currentValue}
          onChange={handleChange}
          className="appearance-none bg-neutral-800/60 backdrop-blur-sm border-2 border-neutral-700/50 text-neutral-200 text-sm rounded-full pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-neutral-600/50 transition-all duration-200 cursor-pointer"
        >
          {sortOptions.map((option) => (
            <option key={option.value} value={option.value} className="bg-neutral-900">
              {option.label}
            </option>
          ))}
        </select>
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-neutral-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}
