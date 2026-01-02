/**
 * Shipping address form component
 * Supports both authenticated users (address selector) and guests (manual form)
 */

import { useState } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { AddressSelector } from "./address-selector";
import type { ShippingAddress } from "../types";

interface ShippingFormProps {
  initialData?: ShippingAddress | null;
  selectedAddressId?: number | null;
  isAuthenticated?: boolean;
  onSubmit: (data: ShippingAddress) => void;
  onSelectAddress?: (addressId: number) => void;
  onBack: () => void;
}

export function ShippingForm({
  initialData,
  selectedAddressId,
  isAuthenticated = false,
  onSubmit,
  onSelectAddress,
  onBack,
}: ShippingFormProps) {
  const [showNewAddressForm, setShowNewAddressForm] = useState(
    !isAuthenticated || !!initialData
  );
  const [formData, setFormData] = useState<ShippingAddress>({
    firstName: initialData?.firstName || "",
    lastName: initialData?.lastName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
    address: initialData?.address || "",
    apartment: initialData?.apartment || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    zipCode: initialData?.zipCode || "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof ShippingAddress, string>>
  >({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name as keyof ShippingAddress]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingAddress, string>> = {};

    if (!formData.firstName.trim())
      newErrors.firstName = "First name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Invalid email format";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.city.trim()) newErrors.city = "City is required";
    if (!formData.state.trim()) newErrors.state = "State is required";
    if (!formData.zipCode.trim()) {
      newErrors.zipCode = "ZIP code is required";
    } else if (!/^\d{5}(-\d{4})?$/.test(formData.zipCode)) {
      newErrors.zipCode = "Invalid ZIP code";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const handleAddressSelect = (addressId: number) => {
    onSelectAddress?.(addressId);
  };

  const handleContinueWithSelected = () => {
    if (selectedAddressId && onSelectAddress) {
      // The checkout route will handle fetching the full address
      // For now, we just move to the next step with the selected ID
      onSelectAddress(selectedAddressId);
    }
  };

  const inputClass = (field: keyof ShippingAddress) => `
    w-full px-4 py-3 bg-neutral-800/60 border rounded-xl text-neutral-100 placeholder-neutral-500
    focus:outline-none focus:ring-2 focus:ring-primary-400/50 focus:border-primary-400 transition-all
    ${errors[field] ? "border-red-500" : "border-neutral-700/50"}
  `;

  // For authenticated users, show address selector unless they want to add new
  if (isAuthenticated && !showNewAddressForm) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="font-display text-2xl font-semibold text-primary-200 mb-2">
            Shipping Address
          </h2>
          <p className="text-foreground/60 text-sm">
            Select a saved address or add a new one
          </p>
        </div>

        <AddressSelector
          selectedId={selectedAddressId ?? null}
          onSelect={handleAddressSelect}
          onAddNew={() => setShowNewAddressForm(true)}
        />

        <div className="flex items-center gap-4 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-2 px-6 py-3 text-neutral-300 hover:text-neutral-100 font-medium transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </button>

          <button
            type="button"
            onClick={handleContinueWithSelected}
            disabled={!selectedAddressId}
            className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Continue to Delivery
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show the form (for guests or when adding new address)
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-semibold text-primary-200 mb-2">
          {isAuthenticated ? "New Shipping Address" : "Shipping Information"}
        </h2>
        {isAuthenticated && (
          <button
            type="button"
            onClick={() => setShowNewAddressForm(false)}
            className="text-sm text-primary-400 hover:text-primary-300 transition"
          >
            ← Back to saved addresses
          </button>
        )}
      </div>

      {/* Name row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            First Name *
          </label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            className={inputClass("firstName")}
            placeholder="John"
          />
          {errors.firstName && (
            <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Last Name *
          </label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            className={inputClass("lastName")}
            placeholder="Doe"
          />
          {errors.lastName && (
            <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
          )}
        </div>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Email *
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={inputClass("email")}
            placeholder="john@example.com"
          />
          {errors.email && (
            <p className="text-red-400 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            Phone (optional)
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className={inputClass("phone")}
            placeholder="(555) 123-4567"
          />
        </div>
      </div>

      {/* Address */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Street Address *
        </label>
        <input
          type="text"
          name="address"
          value={formData.address}
          onChange={handleChange}
          className={inputClass("address")}
          placeholder="123 Main Street"
        />
        {errors.address && (
          <p className="text-red-400 text-sm mt-1">{errors.address}</p>
        )}
      </div>

      {/* Apartment */}
      <div>
        <label className="block text-sm font-medium text-neutral-300 mb-2">
          Apartment, suite, etc. (optional)
        </label>
        <input
          type="text"
          name="apartment"
          value={formData.apartment}
          onChange={handleChange}
          className={inputClass("apartment")}
          placeholder="Apt 4B"
        />
      </div>

      {/* City, State, ZIP row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="col-span-2 sm:col-span-2">
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            City *
          </label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className={inputClass("city")}
            placeholder="New York"
          />
          {errors.city && (
            <p className="text-red-400 text-sm mt-1">{errors.city}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            State *
          </label>
          <input
            type="text"
            name="state"
            value={formData.state}
            onChange={handleChange}
            className={inputClass("state")}
            placeholder="NY"
            maxLength={2}
          />
          {errors.state && (
            <p className="text-red-400 text-sm mt-1">{errors.state}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-neutral-300 mb-2">
            ZIP *
          </label>
          <input
            type="text"
            name="zipCode"
            value={formData.zipCode}
            onChange={handleChange}
            className={inputClass("zipCode")}
            placeholder="10001"
          />
          {errors.zipCode && (
            <p className="text-red-400 text-sm mt-1">{errors.zipCode}</p>
          )}
        </div>
      </div>

      {/* Buttons */}
      <div className="flex items-center gap-4 pt-4">
        <button
          type="button"
          onClick={onBack}
          className="flex items-center gap-2 px-6 py-3 text-neutral-300 hover:text-neutral-100 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Cart
        </button>

        <button
          type="submit"
          className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-primary-500 hover:bg-primary-400 text-neutral-950 font-semibold uppercase tracking-wider rounded-full shadow-lg shadow-primary-500/25 hover:shadow-primary-500/40 transition-all duration-200"
        >
          Continue to Delivery
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
