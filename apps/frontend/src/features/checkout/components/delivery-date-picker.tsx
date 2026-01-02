/**
 * Delivery date picker component
 * Shows a calendar with lead time validation for bakery orders
 */

import { useState, useMemo } from "react";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";

interface DeliveryDatePickerProps {
  selectedDate: string | null;
  onSelect: (date: string) => void;
  minLeadTimeHours: number;
  unavailableDays?: number[]; // Days of week (0-6, 0=Sunday) that are unavailable
}

// Get the earliest available date based on lead time
function getEarliestDate(leadTimeHours: number): Date {
  const now = new Date();
  const earliest = new Date(now.getTime() + leadTimeHours * 60 * 60 * 1000);
  // Round up to the next day if we're past the cutoff
  earliest.setHours(0, 0, 0, 0);
  if (earliest.getTime() <= now.getTime()) {
    earliest.setDate(earliest.getDate() + 1);
  }
  return earliest;
}

// Format date as YYYY-MM-DD
function formatDateISO(date: Date): string {
  return date.toISOString().split("T")[0];
}

// Parse YYYY-MM-DD to Date
function parseDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function DeliveryDatePicker({
  selectedDate,
  onSelect,
  minLeadTimeHours,
  unavailableDays = [],
}: DeliveryDatePickerProps) {
  const earliestDate = useMemo(
    () => getEarliestDate(minLeadTimeHours),
    [minLeadTimeHours]
  );

  // Initialize month view to show earliest available date
  const [displayMonth, setDisplayMonth] = useState(() => {
    const initial = selectedDate ? parseDate(selectedDate) : earliestDate;
    return new Date(initial.getFullYear(), initial.getMonth(), 1);
  });

  // Generate calendar days for the current month
  const calendarDays = useMemo(() => {
    const year = displayMonth.getFullYear();
    const month = displayMonth.getMonth();

    // First day of the month
    const firstDay = new Date(year, month, 1);

    // Start from the Sunday of the week containing the first day
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());

    const days: Date[] = [];
    const current = new Date(startDate);

    // Generate 6 weeks of days
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }

    return days;
  }, [displayMonth]);

  const isDateDisabled = (date: Date): boolean => {
    // Before earliest date
    if (date < earliestDate) return true;

    // More than 60 days in the future
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 60);
    if (date > maxDate) return true;

    // Unavailable day of week
    if (unavailableDays.includes(date.getDay())) return true;

    return false;
  };

  const goToPreviousMonth = () => {
    setDisplayMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() - 1);
      // Don't go before current month
      const today = new Date();
      const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      if (newMonth < minMonth) return prev;
      return newMonth;
    });
  };

  const goToNextMonth = () => {
    setDisplayMonth((prev) => {
      const newMonth = new Date(prev);
      newMonth.setMonth(newMonth.getMonth() + 1);
      // Don't go more than 3 months ahead
      const maxMonth = new Date();
      maxMonth.setMonth(maxMonth.getMonth() + 3);
      if (newMonth > maxMonth) return prev;
      return newMonth;
    });
  };

  const formatLeadTimeMessage = (): string => {
    if (minLeadTimeHours === 0) return "Available for same-day delivery";
    if (minLeadTimeHours < 24) return `${minLeadTimeHours} hour notice required`;
    const days = Math.ceil(minLeadTimeHours / 24);
    return `${days} day${days > 1 ? "s" : ""} advance notice required`;
  };

  return (
    <div className="space-y-4">
      {/* Lead time notice */}
      {minLeadTimeHours > 0 && (
        <div className="flex items-center gap-2 text-sm text-secondary-400 bg-secondary-500/10 px-3 py-2 rounded-lg">
          <Calendar className="w-4 h-4" />
          <span>{formatLeadTimeMessage()}</span>
        </div>
      )}

      {/* Calendar header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={goToPreviousMonth}
          className="p-2 hover:bg-neutral-800 rounded-lg transition"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        <span className="font-medium">
          {displayMonth.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </span>

        <button
          type="button"
          onClick={goToNextMonth}
          className="p-2 hover:bg-neutral-800 rounded-lg transition"
          aria-label="Next month"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div
            key={day}
            className="text-xs text-foreground/50 font-medium py-2"
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dateStr = formatDateISO(date);
          const isSelected = selectedDate === dateStr;
          const isDisabled = isDateDisabled(date);
          const isCurrentMonth = date.getMonth() === displayMonth.getMonth();
          const isToday = formatDateISO(new Date()) === dateStr;

          return (
            <button
              key={index}
              type="button"
              disabled={isDisabled}
              onClick={() => onSelect(dateStr)}
              className={`
                aspect-square flex items-center justify-center text-sm rounded-lg transition
                ${!isCurrentMonth ? "text-foreground/30" : ""}
                ${isDisabled ? "text-foreground/20 cursor-not-allowed" : "hover:bg-neutral-800"}
                ${isSelected ? "bg-primary-500 text-white hover:bg-primary-600" : ""}
                ${isToday && !isSelected ? "ring-1 ring-primary-500/50" : ""}
              `}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Selected date display */}
      {selectedDate && (
        <p className="text-sm text-center text-foreground/70">
          Selected:{" "}
          <span className="font-medium text-foreground">
            {parseDate(selectedDate).toLocaleDateString("en-US", {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </span>
        </p>
      )}
    </div>
  );
}
