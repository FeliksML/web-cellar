/**
 * Time slot picker component for delivery scheduling
 */

import { Clock, Sun, Sunset, Moon } from "lucide-react";
import type { TimeSlot } from "../types";

interface TimeSlotPickerProps {
  selectedSlot: TimeSlot | null;
  onSelect: (slot: TimeSlot) => void;
  disabled?: boolean;
}

const TIME_SLOTS: { value: TimeSlot; icon: typeof Sun; description: string }[] = [
  {
    value: "morning",
    icon: Sun,
    description: "9:00 AM - 12:00 PM",
  },
  {
    value: "afternoon",
    icon: Sunset,
    description: "12:00 PM - 5:00 PM",
  },
  {
    value: "evening",
    icon: Moon,
    description: "5:00 PM - 8:00 PM",
  },
];

export function TimeSlotPicker({
  selectedSlot,
  onSelect,
  disabled = false,
}: TimeSlotPickerProps) {
  return (
    <div className="space-y-3">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground/70">
        <Clock className="w-4 h-4" />
        Select a delivery time
      </label>

      <div className="grid grid-cols-3 gap-3">
        {TIME_SLOTS.map(({ value, icon: Icon, description }) => {
          const isSelected = selectedSlot === value;

          return (
            <button
              key={value}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(value)}
              className={`
                flex flex-col items-center p-4 rounded-lg border-2 transition
                ${disabled ? "opacity-50 cursor-not-allowed" : ""}
                ${
                  isSelected
                    ? "border-primary-500 bg-primary-500/10"
                    : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
                }
              `}
            >
              <Icon
                className={`w-6 h-6 mb-2 ${
                  isSelected ? "text-primary-400" : "text-foreground/60"
                }`}
              />
              <span
                className={`text-sm font-medium ${
                  isSelected ? "text-primary-400" : "text-foreground"
                }`}
              >
                {value.charAt(0).toUpperCase() + value.slice(1)}
              </span>
              <span className="text-xs text-foreground/50 mt-1">
                {description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Compact time slot selector for smaller spaces
 */
export function TimeSlotSelector({
  selectedSlot,
  onSelect,
  disabled = false,
}: TimeSlotPickerProps) {
  return (
    <div className="flex gap-2">
      {TIME_SLOTS.map(({ value }) => {
        const isSelected = selectedSlot === value;

        return (
          <button
            key={value}
            type="button"
            disabled={disabled}
            onClick={() => onSelect(value)}
            className={`
              flex-1 py-2 px-3 text-sm rounded-lg border transition
              ${disabled ? "opacity-50 cursor-not-allowed" : ""}
              ${
                isSelected
                  ? "border-primary-500 bg-primary-500 text-white"
                  : "border-neutral-700 hover:border-neutral-600"
              }
            `}
          >
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </button>
        );
      })}
    </div>
  );
}
