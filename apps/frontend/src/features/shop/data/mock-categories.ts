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
    name: "Protein Pieookie",
    slug: "protein-pieookie",
    description: "Pie + Cookie = Pieookie. A unique protein-packed treat.",
    image_url: null,
    display_order: 2,
    is_active: true,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
  },
];
