/**
 * Mock category data for development without backend
 */

import type { Category } from "../types";

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 1,
    name: "Protein Cupcakes",
    slug: "protein-cupcakes",
    description: "Delicious high-protein cupcakes made with real ingredients.",
    image_url: null,
    display_order: 1,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    name: "Protein Brownies",
    slug: "protein-brownies",
    description: "Rich, fudgy brownies packed with protein.",
    image_url: null,
    display_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 3,
    name: "Protein Cookies",
    slug: "protein-cookies",
    description: "Soft-baked protein cookies in amazing flavors.",
    image_url: null,
    display_order: 3,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
  {
    id: 4,
    name: "Protein Bars",
    slug: "protein-bars",
    description: "On-the-go protein bars for busy lifestyles.",
    image_url: null,
    display_order: 4,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
