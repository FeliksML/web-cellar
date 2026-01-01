/**
 * Skeleton loading component for product cards
 */

export function ProductSkeleton() {
  return (
    <div className="text-center animate-pulse">
      {/* Image placeholder with gradient shimmer */}
      <div className="relative mx-auto w-full aspect-square rounded-2xl overflow-hidden bg-neutral-800/60">
        {/* Shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-neutral-700/30 to-transparent animate-shimmer" />
      </div>

      {/* Product info placeholders */}
      <div className="mt-4 space-y-3">
        {/* Name placeholder - two lines */}
        <div className="space-y-2">
          <div className="h-5 bg-neutral-800/60 rounded-lg w-3/4 mx-auto" />
          <div className="h-5 bg-neutral-800/60 rounded-lg w-1/2 mx-auto" />
        </div>

        {/* Dietary badges placeholder */}
        <div className="flex justify-center gap-2">
          <div className="h-5 w-5 bg-neutral-800/60 rounded-full" />
          <div className="h-5 w-5 bg-neutral-800/60 rounded-full" />
          <div className="h-5 w-5 bg-neutral-800/60 rounded-full" />
        </div>

        {/* Price placeholder */}
        <div className="h-6 bg-neutral-800/60 rounded-lg w-16 mx-auto" />

        {/* Protein info placeholder */}
        <div className="h-4 bg-neutral-800/60 rounded-lg w-20 mx-auto" />
      </div>
    </div>
  );
}

interface ProductSkeletonGridProps {
  count?: number;
}

export function ProductSkeletonGrid({ count = 8 }: ProductSkeletonGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductSkeleton key={i} />
      ))}
    </div>
  );
}
