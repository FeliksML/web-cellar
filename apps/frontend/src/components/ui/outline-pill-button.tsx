import { type ButtonHTMLAttributes, forwardRef } from "react";

interface OutlinePillButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: "sm" | "md" | "lg";
}

export const OutlinePillButton = forwardRef<
  HTMLButtonElement,
  OutlinePillButtonProps
>(({ className = "", size = "md", children, ...props }, ref) => {
  const baseStyles = [
    "inline-flex items-center justify-center",
    "rounded-full border-2",
    "border-primary-400",
    "font-semibold uppercase tracking-widest",
    "transition-all duration-200",
    "text-primary-200",
    "hover:border-primary-300",
    "hover:shadow-lg hover:shadow-primary-500/20",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400",
    "focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950",
    "disabled:opacity-50 disabled:cursor-not-allowed",
  ].join(" ");

  const sizes = {
    sm: "px-4 py-1.5 text-xs",
    md: "px-6 py-2 text-sm",
    lg: "px-8 py-3 text-base",
  };

  return (
    <button
      ref={ref}
      className={`${baseStyles} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
});

OutlinePillButton.displayName = "OutlinePillButton";
