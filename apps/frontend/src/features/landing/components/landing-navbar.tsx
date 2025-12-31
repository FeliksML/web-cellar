import { Link } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { ThemeSwitch } from "./theme-switch";
import { navLinks } from "../data/landing.data";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-neutral-950/40">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm uppercase tracking-widest text-neutral-200 hover:text-primary-200 transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Mobile: Spacer for centering logo */}
          <div className="md:hidden w-10" />

          {/* Center: Logo */}
          <div className="flex items-center justify-center">
            <Link
              to="/"
              className="flex items-center justify-center h-10 w-10 rounded-full bg-primary-500 transition-transform hover:scale-105"
            >
              <span className="text-neutral-900 font-bold text-sm">BB</span>
            </Link>
          </div>

          {/* Right: Theme switch + CTA */}
          <div className="flex items-center gap-3">
            <ThemeSwitch />
            <OutlinePillButton size="sm" className="hidden sm:inline-flex">
              SHOP NOW
            </OutlinePillButton>
          </div>
        </div>
      </div>
    </nav>
  );
}
