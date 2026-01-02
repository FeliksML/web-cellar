/**
 * Address mutation hooks
 */

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Address, AddressCreate, AddressUpdate } from "../types";
import { addressKeys } from "./get-addresses";

/**
 * Create a new address
 */
async function createAddress(data: AddressCreate): Promise<Address> {
  const response = await apiClient.post<Address>("/addresses", data);
  return response.data;
}

export function useCreateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

/**
 * Update an existing address
 */
async function updateAddress(
  id: number,
  data: AddressUpdate
): Promise<Address> {
  const response = await apiClient.put<Address>(`/addresses/${id}`, data);
  return response.data;
}

export function useUpdateAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: AddressUpdate }) =>
      updateAddress(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
      queryClient.invalidateQueries({
        queryKey: addressKeys.detail(variables.id),
      });
    },
  });
}

/**
 * Delete an address
 */
async function deleteAddress(id: number): Promise<void> {
  await apiClient.delete(`/addresses/${id}`);
}

export function useDeleteAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}

/**
 * Set an address as default
 */
async function setDefaultAddress(id: number): Promise<Address> {
  const response = await apiClient.post<Address>(`/addresses/${id}/set-default`);
  return response.data;
}

export function useSetDefaultAddress() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: setDefaultAddress,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: addressKeys.all });
    },
  });
}
