/**
 * API hook for fetching user addresses
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Address, AddressType } from "../types";

// Set to true to always use mock data (for development without backend)
const USE_MOCK_DATA = true;

// Mock addresses for development
const MOCK_ADDRESSES: Address[] = [
  {
    id: 1,
    user_id: 1,
    address_type: "shipping",
    is_default: true,
    first_name: "Jane",
    last_name: "Doe",
    phone: "(555) 123-4567",
    address_line1: "123 Main Street",
    address_line2: "Apt 4B",
    city: "San Francisco",
    state: "CA",
    postal_code: "94102",
    country: "US",
    label: "Home",
    delivery_instructions: "Leave at front door",
    full_name: "Jane Doe",
    formatted_address: "123 Main Street, Apt 4B, San Francisco, CA 94102",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    user_id: 1,
    address_type: "shipping",
    is_default: false,
    first_name: "Jane",
    last_name: "Doe",
    phone: "(555) 987-6543",
    address_line1: "456 Oak Avenue",
    address_line2: null,
    city: "San Francisco",
    state: "CA",
    postal_code: "94110",
    country: "US",
    label: "Work",
    delivery_instructions: "Reception desk",
    full_name: "Jane Doe",
    formatted_address: "456 Oak Avenue, San Francisco, CA 94110",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const addressKeys = {
  all: ["addresses"] as const,
  lists: () => [...addressKeys.all, "list"] as const,
  list: (filters: { type?: AddressType }) =>
    [...addressKeys.lists(), filters] as const,
  details: () => [...addressKeys.all, "detail"] as const,
  detail: (id: number) => [...addressKeys.details(), id] as const,
};

interface GetAddressesParams {
  type?: AddressType;
}

async function fetchAddresses(params?: GetAddressesParams): Promise<Address[]> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    let addresses = [...MOCK_ADDRESSES];
    if (params?.type) {
      addresses = addresses.filter((a) => a.address_type === params.type);
    }
    return addresses;
  }

  const queryParams = new URLSearchParams();
  if (params?.type) {
    queryParams.append("address_type", params.type);
  }

  const url = queryParams.toString()
    ? `/addresses?${queryParams.toString()}`
    : "/addresses";

  const response = await apiClient.get<Address[]>(url);
  return response.data;
}

export function useAddresses(params?: GetAddressesParams) {
  return useQuery({
    queryKey: addressKeys.list({ type: params?.type }),
    queryFn: () => fetchAddresses(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

async function fetchAddress(id: number): Promise<Address> {
  // Use mock data if enabled
  if (USE_MOCK_DATA) {
    await new Promise((resolve) => setTimeout(resolve, 200));
    const address = MOCK_ADDRESSES.find((a) => a.id === id);
    if (!address) {
      throw new Error("Address not found");
    }
    return address;
  }

  const response = await apiClient.get<Address>(`/addresses/${id}`);
  return response.data;
}

export function useAddress(id: number) {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => fetchAddress(id),
    enabled: id > 0, // Only fetch if we have a valid ID
    staleTime: 5 * 60 * 1000,
  });
}
