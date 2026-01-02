import { Link } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
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
          <div className="flex items-center justify-center -ml-4 md:ml-0">
            <Link
              to="/"
              className="group relative flex items-center justify-center transition-transform hover:scale-105"
            >
              {/* Glow effect backing */}
              <div className="absolute inset-0 bg-primary-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              <img
                src="/beasty-logo.png"
                alt="Beasty Baker"
                className="relative h-16 md:h-20 w-auto object-contain drop-shadow-[0_0_15px_rgba(217,158,59,0.3)]"
              />
            </Link>
          </div>

          {/* Right: CTA */}
          <div className="flex items-center">
            <OutlinePillButton size="sm" className="hidden sm:inline-flex">
              SHOP NOW
            </OutlinePillButton>
            {/* Mobile: Spacer for centering logo */}
            <div className="sm:hidden w-10" />
          </div>
        </div>
      </div>
    </nav>
  );
}
