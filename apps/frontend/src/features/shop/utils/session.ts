/**
 * Session utilities for guest cart management
 */

const SESSION_ID_KEY = "beasty_baker_session_id";

/**
 * Generate a unique session ID
 */
function generateSessionId(): string {
  // Use crypto.randomUUID if available (modern browsers)
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }

  // Fallback for older browsers
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Get the current session ID from localStorage
 * Returns null if no session exists
 */
export function getSessionId(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(SESSION_ID_KEY);
}

/**
 * Get or create a session ID
 * Creates a new one if none exists
 */
export function getOrCreateSessionId(): string {
  let sessionId = getSessionId();

  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_ID_KEY, sessionId);
  }

  return sessionId;
}

/**
 * Clear the session ID
 * Called when user logs out or cart is merged
 */
export function clearSessionId(): void {
  if (typeof window !== "undefined") {
    localStorage.removeItem(SESSION_ID_KEY);
  }
}

/**
 * Check if a guest session exists
 */
export function hasGuestSession(): boolean {
  return getSessionId() !== null;
}
