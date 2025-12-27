import { useMutation } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { LoginCredentials, TokenResponse } from "../types";

async function loginUser(credentials: LoginCredentials): Promise<TokenResponse> {
  // OAuth2 expects form data, not JSON
  const formData = new URLSearchParams();
  formData.append("username", credentials.email);
  formData.append("password", credentials.password);

  const response = await apiClient.post<TokenResponse>("/auth/login", formData, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });
  return response.data;
}

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}
