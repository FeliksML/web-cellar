/**
 * Mobile filter bar component
 * Collapsible filter UI for mobile shop view
 */

import { useState, useRef, useEffect } from "react";
import { useFilterStore } from "../stores/filter-store";

interface MobileFilterBarProps {
  productCount?: number;
}

export function MobileFilterBar({ productCount }: MobileFilterBarProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setContentHeight] = useState(0);

  const {
    search,
    setSearch,
    isGlutenFree,
    setGlutenFree,
    isDairyFree,
    setDairyFree,
    isVegan,
    setVegan,
    isKetoFriendly,
    setKetoFriendly,
    resetFilters,
  } = useFilterStore();

  // Sync local search with store
  useEffect(() => {
    setSearchValue(search);
  }, [search]);

  // Calculate content height for animation
  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearch(searchValue);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchValue, setSearch]);

  const hasActiveFilters =
    search ||
    isGlutenFree ||
    isDairyFree ||
    isVegan ||
    isKetoFriendly;

  const activeFilterCount = [
    search,
    isGlutenFree,
    isDairyFree,
    isVegan,
    isKetoFriendly,
  ].filter(Boolean).length;

  const dietaryFilters = [
    { key: "gluten-free", label: "Gluten-Free", value: isGlutenFree, setter: setGlutenFree },
    { key: "dairy-free", label: "Dairy-Free", value: isDairyFree, setter: setDairyFree },
    { key: "vegan", label: "Vegan", value: isVegan, setter: setVegan },
    { key: "keto", label: "Keto", value: isKetoFriendly, setter: setKetoFriendly },
  ];

  return (
    <div className="px-5 mb-4">
      {/* Toggle button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between py-3 px-4 rounded-xl transition-colors"
        style={{
          backgroundColor: "rgba(37, 38, 43, 0.8)",
          border: "1px solid rgba(255, 255, 255, 0.06)",
        }}
      >
        <div className="flex items-center gap-3">
          <svg
            className="w-5 h-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{ color: "#D5D6DA" }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.75}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span className="font-medium" style={{ color: "#D5D6DA", fontSize: "14px" }}>
            Filters
          </span>
          {activeFilterCount > 0 && (
            <span
              className="px-2 py-0.5 rounded-full text-xs font-bold"
              style={{ backgroundColor: "#D6A952", color: "#1D1205" }}
            >
              {activeFilterCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-3">
          {productCount !== undefined && (
            <span className="text-sm" style={{ color: "#8B8D92" }}>
              {productCount} products
            </span>
          )}
          <svg
            className="w-5 h-5 transition-transform duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            style={{
              color: "#8B8D92",
              transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </button>

      {/* Expandable content */}
      <div
        className="overflow-hidden transition-all duration-300 ease-out"
        style={{
          maxHeight: isExpanded ? contentHeight : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div ref={contentRef} className="pt-4 space-y-4">
          {/* Search input */}
          <div className="relative">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              style={{ color: "#8B8D92" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search products..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl text-sm placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-primary-400/50"
              style={{
                backgroundColor: "#1F2126",
                color: "#D5D6DA",
                border: "1px solid rgba(255, 255, 255, 0.06)",
              }}
            />
            {searchValue && (
              <button
                onClick={() => setSearchValue("")}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: "#8B8D92" }}
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Dietary filter pills */}
          <div className="flex flex-wrap gap-2">
            {dietaryFilters.map((filter) => (
              <button
                key={filter.key}
                onClick={() => filter.setter(filter.value ? undefined : true)}
                className="px-3 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: filter.value ? "#D6A952" : "#1F2126",
                  color: filter.value ? "#1D1205" : "#D5D6DA",
                  border: filter.value ? "none" : "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                {filter.label}
              </button>
            ))}
          </div>

          {/* Clear filters button */}
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="w-full py-2 rounded-lg text-sm font-medium transition-colors"
              style={{
                color: "#D6A952",
                border: "1px solid #D6A952",
              }}
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
