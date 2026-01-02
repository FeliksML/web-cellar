/**
 * Address selector component for authenticated users
 * Shows saved addresses and allows selection or adding new
 */

import { MapPin, Plus, Check } from "lucide-react";
import { useAddresses } from "@/features/addresses";
import type { Address } from "@/features/addresses";

interface AddressSelectorProps {
  selectedId: number | null;
  onSelect: (addressId: number) => void;
  onAddNew: () => void;
}

export function AddressSelector({
  selectedId,
  onSelect,
  onAddNew,
}: AddressSelectorProps) {
  const { data: addresses, isLoading, error } = useAddresses({ type: "shipping" });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-24 bg-neutral-800/50 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-400 text-sm p-4 bg-red-500/10 rounded-lg">
        Failed to load addresses. Please try again.
      </div>
    );
  }

  const hasAddresses = addresses && addresses.length > 0;

  return (
    <div className="space-y-4">
      {hasAddresses ? (
        <>
          <p className="text-sm text-foreground/70">
            Select a delivery address:
          </p>
          <div className="space-y-3">
            {addresses.map((address) => (
              <AddressCard
                key={address.id}
                address={address}
                isSelected={selectedId === address.id}
                onSelect={() => onSelect(address.id)}
              />
            ))}
          </div>
        </>
      ) : (
        <div className="text-center py-6 text-foreground/60">
          <MapPin className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">No saved addresses</p>
        </div>
      )}

      <button
        type="button"
        onClick={onAddNew}
        className="w-full flex items-center justify-center gap-2 py-3 px-4 border-2 border-dashed border-neutral-700 rounded-lg text-foreground/70 hover:border-primary-500 hover:text-primary-400 transition"
      >
        <Plus className="w-4 h-4" />
        <span>Add new address</span>
      </button>
    </div>
  );
}

interface AddressCardProps {
  address: Address;
  isSelected: boolean;
  onSelect: () => void;
}

function AddressCard({ address, isSelected, onSelect }: AddressCardProps) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full text-left p-4 rounded-lg border-2 transition ${
        isSelected
          ? "border-primary-500 bg-primary-500/10"
          : "border-neutral-700 bg-neutral-800/50 hover:border-neutral-600"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="font-medium text-foreground">
              {address.full_name}
            </span>
            {address.is_default && (
              <span className="text-[10px] px-1.5 py-0.5 bg-secondary-500/20 text-secondary-400 rounded-full">
                Default
              </span>
            )}
            {address.label && (
              <span className="text-[10px] px-1.5 py-0.5 bg-neutral-700 text-foreground/70 rounded-full">
                {address.label}
              </span>
            )}
          </div>
          <p className="text-sm text-foreground/70">
            {address.address_line1}
            {address.address_line2 && `, ${address.address_line2}`}
          </p>
          <p className="text-sm text-foreground/70">
            {address.city}, {address.state} {address.postal_code}
          </p>
          {address.phone && (
            <p className="text-sm text-foreground/50 mt-1">{address.phone}</p>
          )}
        </div>

        <div
          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
            isSelected
              ? "border-primary-500 bg-primary-500"
              : "border-neutral-600"
          }`}
        >
          {isSelected && <Check className="w-3 h-3 text-white" />}
        </div>
      </div>

      {address.delivery_instructions && (
        <p className="text-xs text-foreground/50 mt-2 italic">
          Note: {address.delivery_instructions}
        </p>
      )}
    </button>
  );
}
