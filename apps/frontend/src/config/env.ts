const envSchema = {
  VITE_API_URL: import.meta.env.VITE_API_URL,
  VITE_APP_NAME: import.meta.env.VITE_APP_NAME,
} as const;

// Validate required environment variables
const requiredVars = ["VITE_API_URL"] as const;

for (const key of requiredVars) {
  if (!envSchema[key]) {
    console.warn(`Missing environment variable: ${key}`);
  }
}

export const env = {
  apiUrl: envSchema.VITE_API_URL || "http://localhost:8000",
  appName: envSchema.VITE_APP_NAME || "Web Cellar",
} as const;
