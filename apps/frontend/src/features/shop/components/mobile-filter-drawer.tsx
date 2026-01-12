/**
 * Mobile filter drawer component
 * Bottom sheet with category filter pills
 */

import { useState, useEffect } from "react";
import { useCategories } from "../api/get-categories";
import { useFilterStore } from "../stores/filter-store";

interface MobileFilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileFilterDrawer({ isOpen, onClose }: MobileFilterDrawerProps) {
  const { data: categories } = useCategories();
  const { category: activeCategory, setCategory } = useFilterStore();

  // Local state for pending selection (applied on "Apply" button)
  const [pendingCategory, setPendingCategory] = useState<string | null>(activeCategory);
  const [isAnimating, setIsAnimating] = useState(false);

  // Sync pending state when drawer opens
  useEffect(() => {
    if (isOpen) {
      setPendingCategory(activeCategory);
      // Trigger animation
      requestAnimationFrame(() => {
        setIsAnimating(true);
      });
    } else {
      setIsAnimating(false);
    }
  }, [isOpen, activeCategory]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  const handleApply = () => {
    setCategory(pendingCategory);
    onClose();
  };

  const handleClear = () => {
    setPendingCategory(null);
  };

  const filterCount = pendingCategory ? 1 : 0;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`absolute bottom-0 left-0 right-0 transition-transform duration-300 ease-out ${
          isAnimating ? "translate-y-0" : "translate-y-full"
        }`}
        style={{
          backgroundColor: "#1A1B1F",
          borderRadius: "24px 24px 0 0",
          maxHeight: "70vh",
        }}
      >
        {/* Drag handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div
            className="w-10 h-1 rounded-full"
            style={{ backgroundColor: "#3A3B40" }}
          />
        </div>

        {/* Content */}
        <div className="px-5 pb-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3
              className="font-semibold"
              style={{ fontSize: "18px", color: "#D5D6DA" }}
            >
              Filters
            </h3>
            <button
              onClick={onClose}
              className="p-2 -mr-2 rounded-full transition-colors"
              style={{ color: "#8B8D92" }}
              aria-label="Close"
            >
              <svg
                className="w-5 h-5"
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
          </div>

          {/* Categories section */}
          <div className="mb-6">
            <h4
              className="font-medium mb-3"
              style={{ fontSize: "14px", color: "#73747A", letterSpacing: "0.05em" }}
            >
              CATEGORIES
            </h4>
            <div className="flex flex-wrap gap-2">
              {/* "All" pill */}
              <button
                onClick={() => setPendingCategory(null)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                style={{
                  backgroundColor: pendingCategory === null ? "#D6A952" : "#25262B",
                  color: pendingCategory === null ? "#1D1205" : "#D5D6DA",
                  border: pendingCategory === null ? "none" : "1px solid rgba(255, 255, 255, 0.06)",
                }}
              >
                All
              </button>

              {/* Category pills */}
              {categories?.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setPendingCategory(cat.slug)}
                  className="px-4 py-2 rounded-full text-sm font-medium transition-colors"
                  style={{
                    backgroundColor: pendingCategory === cat.slug ? "#D6A952" : "#25262B",
                    color: pendingCategory === cat.slug ? "#1D1205" : "#D5D6DA",
                    border: pendingCategory === cat.slug ? "none" : "1px solid rgba(255, 255, 255, 0.06)",
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3">
            {/* Clear button */}
            <button
              onClick={handleClear}
              disabled={!pendingCategory}
              className="flex-1 py-3 rounded-xl text-sm font-medium transition-colors disabled:opacity-40"
              style={{
                color: "#D6A952",
                border: "1px solid #D6A952",
                backgroundColor: "transparent",
              }}
            >
              Clear
            </button>

            {/* Apply button */}
            <button
              onClick={handleApply}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
              style={{
                backgroundColor: "#D6A952",
                color: "#1D1205",
              }}
            >
              Apply
              {filterCount > 0 && (
                <span
                  className="px-2 py-0.5 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: "rgba(0,0,0,0.2)",
                    color: "#1D1205",
                  }}
                >
                  {filterCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Safe area padding for iOS */}
        <div className="h-[env(safe-area-inset-bottom)]" />
      </div>
    </div>
  );
}
