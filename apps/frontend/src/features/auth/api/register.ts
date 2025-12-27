import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { RegisterCredentials, User } from "../types";

async function registerUser(credentials: RegisterCredentials): Promise<User> {
  const response = await apiClient.post<User>("/auth/register", credentials);
  return response.data;
}

export function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}
