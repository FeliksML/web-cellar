import { useState } from "react";
import { Link } from "react-router-dom";
import { MobileNavDrawer } from "./mobile-nav-drawer";

export function LandingNavbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 h-[104px]">
      <div className="relative h-full mx-auto w-full max-w-screen-xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-full">

          {/* Left: Menu button */}
          <button
            className="flex items-center justify-center w-11 h-11 rounded-xl text-neutral-100 hover:bg-white/5 transition-colors"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>

          {/* Center: Logo */}
          <Link
            to="/"
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
          >
            <img
              src="/beasty-logo.png"
              alt="Beasty Baker"
              className="w-20 h-auto object-contain"
            />
          </Link>

          {/* Right: Cart button with badge */}
          <Link
            to="/cart"
            className="relative flex items-center justify-center w-11 h-11 rounded-xl text-neutral-100 hover:bg-white/5 transition-colors"
            aria-label="Shopping cart"
          >
            <svg
              className="w-[26px] h-[26px]"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.75}
              viewBox="0 0 24 24"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="9" cy="21" r="1" />
              <circle cx="20" cy="21" r="1" />
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
            </svg>
            {/* Badge dot */}
            <span
              className="absolute top-2 right-2 w-2 h-2 rounded-full"
              style={{ backgroundColor: "#D8B571" }}
            />
          </Link>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
      />
    </nav>
  );
}
