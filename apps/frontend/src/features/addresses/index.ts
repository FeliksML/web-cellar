/**
 * Addresses feature exports
 */

// Types
export * from "./types";

// API hooks
export { useAddresses, useAddress, addressKeys } from "./api/get-addresses";
export {
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from "./api/mutations";
