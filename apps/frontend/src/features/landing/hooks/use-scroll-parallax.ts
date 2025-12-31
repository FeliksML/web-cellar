import { useState, useEffect, useRef, useCallback } from "react";

interface UseScrollParallaxOptions {
  /** Parallax intensity (0-1). Default: 0.08 for subtle effect */
  intensity?: number;
  /** Maximum offset in pixels. Default: 25 */
  maxOffset?: number;
  /** Direction of parallax. Default: 'up' (moves up as you scroll down) */
  direction?: "up" | "down";
}

interface ScrollParallaxResult {
  ref: React.RefObject<HTMLDivElement | null>;
  style: React.CSSProperties;
}

export function useScrollParallax(
  options: UseScrollParallaxOptions = {}
): ScrollParallaxResult {
  const { intensity = 0.08, maxOffset = 25, direction = "up" } = options;
  const ref = useRef<HTMLDivElement | null>(null);
  const [offset, setOffset] = useState(0);

  const handleScroll = useCallback(() => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;

    // Calculate how far the element is from the center of the viewport
    const elementCenter = rect.top + rect.height / 2;
    const viewportCenter = viewportHeight / 2;
    const distanceFromCenter = elementCenter - viewportCenter;

    // Normalize to a value between -1 and 1
    const normalizedDistance = distanceFromCenter / viewportHeight;

    // Apply intensity and clamp to maxOffset
    let calculatedOffset = normalizedDistance * intensity * 100;
    calculatedOffset = Math.max(
      -maxOffset,
      Math.min(maxOffset, calculatedOffset)
    );

    if (direction === "down") {
      calculatedOffset = -calculatedOffset;
    }

    setOffset(calculatedOffset);
  }, [intensity, maxOffset, direction]);

  useEffect(() => {
    // Use passive event listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return {
    ref,
    style: {
      transform: `translateY(${offset}px)`,
      willChange: "transform",
    },
  };
}
