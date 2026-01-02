import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { navLinks } from "../data/landing.data";

interface MobileNavDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileNavDrawer({ isOpen, onClose }: MobileNavDrawerProps) {
  const { pathname } = useLocation();

  if (!isOpen) return null;

  // Use portal to render outside nav's stacking context
  return createPortal(
    <>
      {/* Backdrop overlay - very high z-index */}
      <div
        className="fixed inset-0 bg-black/60 z-[9998] md:hidden"
        onClick={onClose}
      />

      {/* Slide-in drawer */}
      <div className="fixed top-0 right-0 h-full w-64 bg-neutral-900 z-[9999] md:hidden shadow-xl">
        <div className="flex flex-col p-6 pt-24">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              to={link.href}
              onClick={onClose}
              className="py-3 text-lg font-medium text-neutral-200 hover:text-primary-400 transition-colors border-b border-neutral-800"
            >
              {link.label}
            </Link>
          ))}

          {/* Shop Now CTA - hide when already on shop page */}
          {!pathname.startsWith("/shop") && (
            <Link
              to="/shop"
              onClick={onClose}
              className="mt-6 py-3 px-6 bg-primary-500 text-neutral-950 font-semibold rounded-full text-center hover:bg-primary-400 transition-colors"
            >
              SHOP NOW
            </Link>
          )}
        </div>
      </div>
    </>,
    document.body
  );
}
