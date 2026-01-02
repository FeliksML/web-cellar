import { Link } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { navLinks } from "../data/landing.data";

export function LandingNavbar() {
  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-neutral-950/40">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          {/* Left: Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="group relative flex items-center transition-transform hover:scale-105"
            >
              <img
                src="/beasty-logo-full.png"
                alt="Beasty Baker"
                className="h-20 md:h-24 w-auto object-contain drop-shadow-[0_0_15px_rgba(217,158,59,0.3)]"
              />
            </Link>
          </div>

          {/* Center: Nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-10 lg:gap-16">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-300 hover:text-primary-400 transition-colors"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right: CTA */}
          <div className="flex items-center">
            <OutlinePillButton size="sm" className="hidden sm:inline-flex border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-neutral-950">
              SHOP NOW
            </OutlinePillButton>

            {/* Mobile Menu Icon Placeholder (for future implementation) */}
            <button className="md:hidden p-2 text-neutral-200">
              <span className="sr-only">Open menu</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
