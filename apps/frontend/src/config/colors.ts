// Beasty Baker brand color palette
// These values are also defined as CSS custom properties in globals.css for Tailwind

export const colors = {
  // Primary: Gold/Amber - Warmth, premium quality
  primary: {
    50: "#FFF7E6",
    100: "#FFE8BF",
    200: "#FAD89B",
    300: "#F5C784",
    400: "#ECB45E",
    500: "#D99E3B",
    600: "#B77E22",
    700: "#8E5F15",
    800: "#5F3D0F",
    900: "#3B250B",
    950: "#251807",
  },

  // Secondary: Herbal/Emerald - Natural, healthy
  secondary: {
    50: "#ECFFF6",
    100: "#D2FBE7",
    200: "#A9F3CF",
    300: "#78E2B0",
    400: "#39C78B",
    500: "#1FA66F",
    600: "#168457",
    700: "#136947",
    800: "#0F4A33",
    900: "#0A2F22",
    950: "#061E16",
  },

  // Neutral: Warm browns - Earthy, organic
  neutral: {
    50: "#FAF7F2",
    100: "#F2ECE2",
    200: "#D8CFC1",
    300: "#B7AA9B",
    400: "#8A7A6C",
    500: "#5B4A3E",
    600: "#3B2B24",
    700: "#251A17",
    800: "#150E0E",
    900: "#0B0A0C",
    950: "#050406",
  },

  // Accent: Glow colors for hero effects
  accent: {
    glowPurple: "#9B6BFF",
    glowGreenGold: "#E1CE71",
  },
} as const;

export type ColorScale = typeof colors;
