import { Link, useLocation } from "react-router-dom";

interface TabItem {
  id: string;
  label: string;
  href: string;
  icon: "home" | "store" | "info" | "shopping-cart";
  hasBadge?: boolean;
}

const tabs: TabItem[] = [
  { id: "home", label: "Home", href: "/", icon: "home" },
  { id: "shop", label: "Shop", href: "/shop", icon: "store" },
  { id: "about", label: "About", href: "/about", icon: "info" },
  { id: "cart", label: "Cart", href: "/cart", icon: "shopping-cart", hasBadge: true },
];

function TabIcon({ name, className }: { name: TabItem["icon"]; className?: string }) {
  const iconClass = `w-[22px] h-[22px] ${className || ""}`;

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

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 h-[62px] border-t md:hidden"
      style={{
        backgroundColor: "#333238",
        borderColor: "#353439"
      }}
    >
      <div className="flex items-center justify-around h-full max-w-screen-sm mx-auto">
        {tabs.map((tab) => {
          const active = isActive(tab.href);
          const color = active ? "#D8B571" : "#929295";

          return (
            <Link
              key={tab.id}
              to={tab.href}
              className="relative flex flex-col items-center justify-center gap-1 px-4 py-2 transition-colors"
              style={{ color }}
            >
              <div className="relative">
                <TabIcon name={tab.icon} />
                {tab.hasBadge && (
                  <span
                    className="absolute -top-1 -right-1 w-2 h-2 rounded-full"
                    style={{ backgroundColor: "#D8B571" }}
                  />
                )}
              </div>
              <span
                className="text-xs font-medium"
                style={{
                  fontSize: "12px",
                  lineHeight: "14px"
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
