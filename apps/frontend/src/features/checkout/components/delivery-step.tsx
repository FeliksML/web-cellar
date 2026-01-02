/**
 * Delivery step component for checkout
 * Combines fulfillment type, date picker, and time slot selection
 */

import { useState, useEffect } from "react";
import { Truck, Store, ArrowLeft, ArrowRight } from "lucide-react";
import { DeliveryDatePicker } from "./delivery-date-picker";
import { TimeSlotPicker } from "./time-slot-picker";
import type { DeliveryPreferences, FulfillmentType, TimeSlot } from "../types";

interface DeliveryStepProps {
  initialPreferences?: DeliveryPreferences | null;
  minLeadTimeHours: number;
  onSubmit: (preferences: DeliveryPreferences) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

// Store address for pickup (would come from config in production)
const STORE_ADDRESS = {
  name: "Beasty Baker",
  address: "123 Main Street",
  city: "San Francisco, CA 94102",
  hours: "Tue-Sat: 8am - 6pm",
};

export function DeliveryStep({
  initialPreferences,
  minLeadTimeHours,
  onSubmit,
  onBack,
  isSubmitting = false,
}: DeliveryStepProps) {
  const [fulfillmentType, setFulfillmentType] = useState<FulfillmentType>(
    initialPreferences?.fulfillmentType || "delivery"
  );
  const [selectedDate, setSelectedDate] = useState<string | null>(
    initialPreferences?.requestedDate || null
  );
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(
    initialPreferences?.timeSlot || null
  );
  const [error, setError] = useState<string | null>(null);

  // Validate before submission
  const handleSubmit = () => {
    if (!selectedDate) {
      setError("Please select a delivery date");
      return;
    }

    if (fulfillmentType === "delivery" && !selectedSlot) {
      setError("Please select a time slot");
      return;
    }

    setError(null);
    onSubmit({
      fulfillmentType,
      requestedDate: selectedDate,
      timeSlot: fulfillmentType === "delivery" ? selectedSlot : null,
    });
  };

  // Clear error when selections change
  useEffect(() => {
    setError(null);
  }, [selectedDate, selectedSlot, fulfillmentType]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-semibold mb-2">Delivery Options</h2>
        <p className="text-foreground/60 text-sm">
          Choose how you'd like to receive your order
        </p>
      </div>

      {/* Fulfillment Type Toggle */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground/70">
          Fulfillment Method
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setFulfillmentType("delivery")}
            className={`
              flex items-center gap-3 p-4 rounded-lg border-2 transition
              ${
                fulfillmentType === "delivery"
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
              }
            `}
          >
            <Truck
              className={`w-5 h-5 ${
                fulfillmentType === "delivery"
                  ? "text-primary-400"
                  : "text-foreground/60"
              }`}
            />
            <div className="text-left">
              <p
                className={`font-medium ${
                  fulfillmentType === "delivery"
                    ? "text-primary-400"
                    : "text-foreground"
                }`}
              >
                Delivery
              </p>
              <p className="text-xs text-foreground/50">We'll bring it to you</p>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setFulfillmentType("pickup")}
            className={`
              flex items-center gap-3 p-4 rounded-lg border-2 transition
              ${
                fulfillmentType === "pickup"
                  ? "border-primary-500 bg-primary-500/10"
                  : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
              }
            `}
          >
            <Store
              className={`w-5 h-5 ${
                fulfillmentType === "pickup"
                  ? "text-primary-400"
                  : "text-foreground/60"
              }`}
            />
            <div className="text-left">
              <p
                className={`font-medium ${
                  fulfillmentType === "pickup"
                    ? "text-primary-400"
                    : "text-foreground"
                }`}
              >
                Pickup
              </p>
              <p className="text-xs text-foreground/50">Pick up at store</p>
            </div>
          </button>
        </div>
      </div>

      {/* Pickup Store Info */}
      {fulfillmentType === "pickup" && (
        <div className="bg-neutral-800/50 rounded-lg p-4 border border-neutral-700">
          <h3 className="font-medium mb-2">{STORE_ADDRESS.name}</h3>
          <p className="text-sm text-foreground/70">{STORE_ADDRESS.address}</p>
          <p className="text-sm text-foreground/70">{STORE_ADDRESS.city}</p>
          <p className="text-xs text-foreground/50 mt-2">{STORE_ADDRESS.hours}</p>
        </div>
      )}

      {/* Date Selection */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground/70">
          {fulfillmentType === "delivery" ? "Delivery Date" : "Pickup Date"}
        </label>
        <DeliveryDatePicker
          selectedDate={selectedDate}
          onSelect={setSelectedDate}
          minLeadTimeHours={minLeadTimeHours}
        />
      </div>

      {/* Time Slot (Delivery only) */}
      {fulfillmentType === "delivery" && (
        <TimeSlotPicker
          selectedSlot={selectedSlot}
          onSelect={setSelectedSlot}
          disabled={!selectedDate}
        />
      )}

      {/* Error Message */}
      {error && (
        <p className="text-sm text-red-400 bg-red-500/10 px-4 py-2 rounded-lg">
          {error}
        </p>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 border border-neutral-700 rounded-lg hover:bg-neutral-800 transition disabled:opacity-50"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shipping
        </button>

        <button
          type="button"
          onClick={handleSubmit}
          disabled={isSubmitting || !selectedDate}
          className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            "Processing..."
          ) : (
            <>
              Place Order
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </div>
    </div>
  );
}
