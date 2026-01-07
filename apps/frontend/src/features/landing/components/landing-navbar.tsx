import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { OutlinePillButton } from "@/components/ui/outline-pill-button";
import { MobileNavDrawer } from "./mobile-nav-drawer";

// Split nav links for centered logo layout
const leftNavLinks = [
  { label: "HOME", href: "/" },
  { label: "SHOP", href: "/shop" },
];

const rightNavLinks = [
  { label: "ABOUT US", href: "/about" },
];

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { pathname } = useLocation();

  return (
    <nav className="sticky top-0 z-50 backdrop-blur bg-neutral-950/60">
      <div className="mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        {/* Navbar with centered logo */}
        <div className="relative flex items-center justify-between py-2">

          {/* Left: Nav links (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1">
            {leftNavLinks.map((link, index) => (
              <div key={link.label} className="flex items-center gap-6 lg:gap-8">
                {index > 0 && (
                  <div className="h-4 w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent opacity-60" />
                )}
                <Link
                  to={link.href}
                  className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-300 hover:text-primary-400 transition-colors"
                  style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
                >
                  {link.label}
                </Link>
              </div>
            ))}
          </div>

          {/* Center: Logo - absolutely positioned for true centering */}
          <div className="absolute left-1/2 -translate-x-1/2 z-10">
            <Link
              to="/"
              className="group relative flex items-center transition-transform hover:scale-105"
            >
              <img
                src="/beasty-logo-full.png"
                alt="Beasty Baker"
                className="h-16 sm:h-20 md:h-24 lg:h-28 w-auto object-contain -mb-4 sm:-mb-6 md:-mb-8 drop-shadow-[0_0_20px_rgba(217,158,59,0.4)]"
              />
            </Link>
          </div>

          {/* Right: Nav links + CTA (hidden on mobile) */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 flex-1 justify-end">
            {rightNavLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className="text-sm font-medium uppercase tracking-[0.2em] text-neutral-300 hover:text-primary-400 transition-colors"
                style={{ textShadow: "0 2px 10px rgba(0,0,0,0.5)" }}
              >
                {link.label}
              </Link>
            ))}

            {/* Golden divider before SHOP NOW */}
            <div className="h-4 w-px bg-gradient-to-b from-transparent via-primary-500 to-transparent opacity-60" />

            {/* Only show Shop Now when not already on shop page */}
            {!pathname.startsWith("/shop") ? (
              <Link to="/shop">
                <OutlinePillButton size="sm" className="border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-neutral-950">
                  SHOP NOW
                </OutlinePillButton>
              </Link>
            ) : (
              <div className="w-[100px]" /> /* Spacer to maintain balance */
            )}
          </div>

          {/* Mobile: Logo on left, Menu button on right */}
          <div className="flex md:hidden items-center justify-between w-full">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/beasty-logo-full.png"
                alt="Beasty Baker"
                className="h-14 w-auto object-contain -mb-3 drop-shadow-[0_0_20px_rgba(217,158,59,0.4)]"
              />
            </Link>

            <button
              className="p-2 text-neutral-200"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <span className="sr-only">{mobileMenuOpen ? "Close menu" : "Open menu"}</span>
              {mobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Golden bottom line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-primary-500/10 via-primary-500/80 to-primary-500/10" />

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
}
