/**
 * Address feature types
 */

export type AddressType = "shipping" | "billing";

export interface Address {
  id: number;
  user_id: number;
  address_type: AddressType;
  is_default: boolean;
  first_name: string;
  last_name: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  postal_code: string;
  country: string;
  label: string | null;
  delivery_instructions: string | null;
  full_name: string;
  formatted_address: string;
  created_at: string;
  updated_at: string;
}

export interface AddressCreate {
  address_type?: AddressType;
  first_name: string;
  last_name: string;
  phone?: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
  label?: string;
  delivery_instructions?: string;
  is_default?: boolean;
}

export interface AddressUpdate {
  address_type?: AddressType;
  first_name?: string;
  last_name?: string;
  phone?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  postal_code?: string;
  country?: string;
  label?: string;
  delivery_instructions?: string;
  is_default?: boolean;
}
