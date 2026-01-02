/**
 * Lead time notice component
 * Displays advance notice requirements for bakery products
 */

import { Clock, Calendar } from "lucide-react";

interface LeadTimeNoticeProps {
  leadTimeHours: number;
  variant?: "inline" | "card";
  className?: string;
}

/**
 * Format lead time hours into human-readable text
 */
function formatLeadTime(hours: number): string {
  if (hours === 0) {
    return "Same day available";
  }
  if (hours < 24) {
    return `${hours} hour${hours === 1 ? "" : "s"} notice required`;
  }
  const days = Math.floor(hours / 24);
  const remainingHours = hours % 24;

  if (remainingHours === 0) {
    return `${days} day${days === 1 ? "" : "s"} advance notice`;
  }
  return `${days} day${days === 1 ? "" : "s"} ${remainingHours} hour${remainingHours === 1 ? "" : "s"} advance notice`;
}

/**
 * Get the earliest available date based on lead time
 */
export function getEarliestDate(leadTimeHours: number): Date {
  const now = new Date();
  const earliest = new Date(now.getTime() + leadTimeHours * 60 * 60 * 1000);
  return earliest;
}

export function LeadTimeNotice({
  leadTimeHours,
  variant = "inline",
  className = "",
}: LeadTimeNoticeProps) {
  const isSameDay = leadTimeHours === 0;
  const formattedTime = formatLeadTime(leadTimeHours);

  if (variant === "inline") {
    return (
      <div
        className={`flex items-center gap-1.5 text-secondary-400 ${className}`}
      >
        <Clock className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="text-xs font-medium">{formattedTime}</span>
      </div>
    );
  }

  // Card variant - more prominent display
  return (
    <div
      className={`bg-primary-800/50 border border-primary-700 rounded-lg p-3 ${className}`}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-primary-700/50 rounded-lg">
          {isSameDay ? (
            <Clock className="w-5 h-5 text-green-400" />
          ) : (
            <Calendar className="w-5 h-5 text-secondary-400" />
          )}
        </div>
        <div>
          <p className="text-sm font-semibold text-foreground">
            {isSameDay ? "Available Today" : "Advance Order Required"}
          </p>
          <p className="text-xs text-foreground/60 mt-0.5">{formattedTime}</p>
          {!isSameDay && (
            <p className="text-xs text-foreground/50 mt-1">
              Earliest delivery:{" "}
              {getEarliestDate(leadTimeHours).toLocaleDateString(undefined, {
                weekday: "short",
                month: "short",
                day: "numeric",
              })}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Compact lead time badge for product cards
 */
export function LeadTimeBadge({ leadTimeHours }: { leadTimeHours: number }) {
  if (leadTimeHours === 0) {
    return (
      <span className="text-[10px] px-1.5 py-0.5 bg-green-500/20 text-green-400 rounded-full font-medium">
        Same Day
      </span>
    );
  }

  const days = Math.ceil(leadTimeHours / 24);
  return (
    <span className="text-[10px] px-1.5 py-0.5 bg-primary-600/50 text-foreground/70 rounded-full font-medium flex items-center gap-1">
      <Clock className="w-2.5 h-2.5" />
      {days}d
    </span>
  );
}
