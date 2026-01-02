/**
 * API hook for fetching user addresses
 */

import { useQuery } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Address, AddressType } from "../types";

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
  const response = await apiClient.get<Address>(`/addresses/${id}`);
  return response.data;
}

export function useAddress(id: number) {
  return useQuery({
    queryKey: addressKeys.detail(id),
    queryFn: () => fetchAddress(id),
    staleTime: 5 * 60 * 1000,
  });
}
