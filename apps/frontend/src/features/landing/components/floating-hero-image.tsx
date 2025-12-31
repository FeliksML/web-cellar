import { useState, useEffect, useRef } from "react";
import { useScrollParallax } from "../hooks/use-scroll-parallax";

interface FloatingHeroImageProps {
  src: string;
  alt: string;
  /** Enable floating animation. Default: true */
  animate?: boolean;
  /** Enable parallax on scroll. Default: true */
  parallax?: boolean;
  /** Custom className for additional styling */
  className?: string;
}

export function FloatingHeroImage({
  src,
  alt,
  animate = true,
  parallax = true,
  className = "",
}: FloatingHeroImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const { ref: parallaxRef, style: parallaxStyle } = useScrollParallax({
    intensity: 0.08,
    maxOffset: 25,
    direction: "up",
  });

  // Intersection Observer for lazy loading trigger
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "100px", // Start loading 100px before entering viewport
        threshold: 0,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Combine refs for both container observation and parallax
  const setRefs = (element: HTMLDivElement | null) => {
    containerRef.current = element;
    if (parallaxRef && typeof parallaxRef === "object") {
      (parallaxRef as React.MutableRefObject<HTMLDivElement | null>).current =
        element;
    }
  };

  return (
    <div
      ref={setRefs}
      className={`relative ${className}`}
      style={parallax ? parallaxStyle : undefined}
    >
      {/* Loading placeholder - matches responsive sizes */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-32 h-40 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 animate-pulse" />
        </div>
      )}

      {/* The actual image - only rendered when in view */}
      {isInView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => setIsLoaded(true)}
          className={`
            w-full h-auto object-contain
            ${animate ? "animate-float-gentle" : ""}
            hero-image-glow
            transition-opacity duration-700
            ${isLoaded ? "opacity-100" : "opacity-0"}
          `}
        />
      )}
    </div>
  );
}
