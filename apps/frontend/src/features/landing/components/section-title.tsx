interface SectionTitleProps {
  children: React.ReactNode;
}

export function SectionTitle({ children }: SectionTitleProps) {
  return (
    <div className="flex items-center justify-center gap-4">
      <div className="h-px flex-1 bg-primary-400/50" />
      <h2 className="uppercase tracking-widest text-sm font-semibold text-primary-200">
        {children}
      </h2>
      <div className="h-px flex-1 bg-primary-400/50" />
    </div>
  );
}
