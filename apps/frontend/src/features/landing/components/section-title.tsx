interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-center gap-4 sm:gap-6">
      {/* Left decorative line */}
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-r from-transparent to-primary-500/60" />

      {/* Title with Playfair Display */}
      <h2
        className="font-display text-lg sm:text-xl md:text-2xl font-medium text-primary-400 tracking-wide text-center"
        style={{ textShadow: '0 1px 12px rgba(236, 180, 94, 0.2)' }}
      >
        {children}
      </h2>

      {/* Right decorative line */}
      <div className="h-px flex-1 max-w-[120px] bg-gradient-to-l from-transparent to-primary-500/60" />
    </div>
  );
}
