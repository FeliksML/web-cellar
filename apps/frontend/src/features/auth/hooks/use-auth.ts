import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { useAuthStore } from "../stores/auth-store";
import { useLogin } from "../api/login";
import { useRegister } from "../api/register";
import { useCurrentUser } from "../api/get-me";
import type { LoginCredentials, RegisterCredentials } from "../types";

export function useAuth() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, token, isAuthenticated, setAuth, logout: logoutStore } = useAuthStore();

  const loginMutation = useLogin();
  const registerMutation = useRegister();
  const { data: currentUser, isLoading: isLoadingUser } = useCurrentUser();

  const login = useCallback(
    async (credentials: LoginCredentials) => {
      const tokenResponse = await loginMutation.mutateAsync(credentials);

      // Fetch user data after login
      const userResponse = await fetch(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/auth/me`,
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      const userData = await userResponse.json();

      setAuth(userData, tokenResponse.access_token);
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
      navigate("/");
    },
    [loginMutation, setAuth, queryClient, navigate]
  );

  const register = useCallback(
    async (credentials: RegisterCredentials) => {
      await registerMutation.mutateAsync(credentials);
      // After registration, log them in
      await login(credentials);
    },
    [registerMutation, login]
  );

  const logout = useCallback(() => {
    logoutStore();
    queryClient.clear();
    navigate("/login");
  }, [logoutStore, queryClient, navigate]);

  return {
    user: currentUser || user,
    token,
    isAuthenticated,
    isLoading: loginMutation.isPending || registerMutation.isPending || isLoadingUser,
    error: loginMutation.error || registerMutation.error,
    login,
    register,
    logout,
  };
}
