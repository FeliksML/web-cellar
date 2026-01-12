export interface User {
  id: number;
  email: string;
  is_active: boolean;
  role: "customer" | "admin" | "super_admin";
  first_name?: string | null;
  last_name?: string | null;
  phone?: string | null;
  created_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}
