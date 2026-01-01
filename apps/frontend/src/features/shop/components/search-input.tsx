/**
 * Search input component with debounce
 */

import { useState, useEffect } from "react";
import { useFilterStore } from "../stores/filter-store";

export function SearchInput() {
  const { search, setSearch } = useFilterStore();
  const [localValue, setLocalValue] = useState(search);

  // Debounce the search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(localValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [localValue, setSearch]);

  // Sync local value when store changes externally
  useEffect(() => {
    setLocalValue(search);
  }, [search]);

  const handleClear = () => {
    setLocalValue("");
    setSearch("");
  };

  return (
    <div className="relative">
      {/* Search icon */}
      <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
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
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      </div>

      {/* Input */}
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search treats..."
        className="w-full sm:w-64 bg-neutral-800/60 backdrop-blur-sm border-2 border-neutral-700/50 text-neutral-200 text-sm rounded-full pl-10 pr-10 py-2.5 placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400/50 hover:border-neutral-600/50 transition-all duration-200"
      />

      {/* Clear button */}
      {localValue && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 text-neutral-400 hover:text-neutral-200 transition-colors"
          aria-label="Clear search"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
    </div>
  );
}
