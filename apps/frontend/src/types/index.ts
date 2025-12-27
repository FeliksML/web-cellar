// Common types used across the application

export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface ApiError {
  detail: string;
}

// Re-export generated API types when available
// export * from "./api";
