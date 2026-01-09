import { Link, useLocation } from "react-router-dom";
import { useCartStore } from "@/features/shop";

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: "home" | "store" | "info" | "shopping-cart";
  showBadge?: boolean;
}

const tabs: TabItem[] = [
  { id: "home", label: "Home", href: "/", icon: "home" },
  { id: "shop", label: "Shop", href: "/shop", icon: "store" },
  { id: "about", label: "About", href: "/about", icon: "info" },
  { id: "cart", label: "Cart", href: "/cart", icon: "shopping-cart", showBadge: true },
];

function TabIcon({ name, className }: { name: TabItem["icon"]; className?: string }) {
  const iconClass = `w-6 h-6 ${className || ""}`;

  switch (name) {
    case "home":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9,22 9,12 15,12 15,22" />
        </svg>
      );
    case "store":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l2.25-4.5A1 1 0 0 1 6.14 4h11.72a1 1 0 0 1 .89.55L21 9" />
          <path d="M21 9v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9" />
          <path d="M3 9h18" />
          <path d="M9 9v3a3 3 0 0 0 6 0V9" />
        </svg>
      );
    case "info":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <line x1="12" y1="16" x2="12" y2="12" />
          <line x1="12" y1="8" x2="12.01" y2="8" />
        </svg>
      );
    case "shopping-cart":
      return (
        <svg className={iconClass} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round">
          <circle cx="9" cy="21" r="1" />
          <circle cx="20" cy="21" r="1" />
          <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" />
        </svg>
      );
    default:
      return null;
  }
}

export function BottomTabBar() {
  const { pathname } = useLocation();
  const cartItems = useCartStore((state) => state.items);
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 h-[96px] glass-tab-bar md:hidden">
      <div
        className="flex items-center justify-around h-full max-w-screen-sm mx-auto"
        style={{ padding: "10px 18px 14px" }}
      >
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const color = active ? "#D6A952" : "#8B8D92";

          return (
            <Link
              key={tab.id}
              to={tab.href}
              className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors"
              style={{ color }}
            >
              <div className="relative">
                <TabIcon name={tab.icon} />
                {tab.showBadge && totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-2 min-w-[18px] h-[18px] rounded-full flex items-center justify-center text-[10px] font-bold"
                    style={{
                      backgroundColor: "#D6A952",
                      color: "#1D1205",
                    }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
              <span
                className="font-medium"
                style={{
                  fontSize: "12px",
                  lineHeight: "14px",
                }}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
