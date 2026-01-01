/**
 * Mock product data for development without backend
 */

import type { ProductListItem, Product, PaginatedProducts } from "../types";

export const MOCK_PRODUCTS: ProductListItem[] = [
  // Cupcakes
  {
    id: 1,
    name: "Blueberry Lemon Protein Cupcake",
    slug: "blueberry-lemon-protein-cupcake",
    price: 6.99,
    compare_at_price: null,
    short_description: "Zesty lemon with fresh blueberries",
    gradient_from: "#6366F1",
    gradient_to: "#8B5CF6",
    is_featured: true,
    is_bestseller: true,
    protein_grams: 15,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 1, name: "Protein Cupcakes", slug: "protein-cupcakes", description: null, image_url: null, display_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 2,
    name: "Pistachio Matcha Protein Cupcake",
    slug: "pistachio-matcha-protein-cupcake",
    price: 7.49,
    compare_at_price: null,
    short_description: "Earthy matcha with crushed pistachios",
    gradient_from: "#39C78B",
    gradient_to: "#E1CE71",
    is_featured: true,
    is_bestseller: false,
    protein_grams: 14,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: true,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 1, name: "Protein Cupcakes", slug: "protein-cupcakes", description: null, image_url: null, display_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 3,
    name: "Apple Cinnamon Protein Cupcake",
    slug: "apple-cinnamon-protein-cupcake",
    price: 5.99,
    compare_at_price: 6.99,
    short_description: "Warm cinnamon with fresh apple chunks",
    gradient_from: "#F59E0B",
    gradient_to: "#B45309",
    is_featured: false,
    is_bestseller: true,
    protein_grams: 13,
    is_gluten_free: true,
    is_dairy_free: true,
    is_vegan: false,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: true,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 1, name: "Protein Cupcakes", slug: "protein-cupcakes", description: null, image_url: null, display_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
  // Brownies
  {
    id: 4,
    name: "Double Chocolate Protein Brownie",
    slug: "double-chocolate-protein-brownie",
    price: 5.49,
    compare_at_price: null,
    short_description: "Intensely fudgy with dark chocolate chips",
    gradient_from: "#44403C",
    gradient_to: "#1C1917",
    is_featured: true,
    is_bestseller: true,
    protein_grams: 20,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: true,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 2, name: "Protein Brownies", slug: "protein-brownies", description: null, image_url: null, display_order: 2, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 5,
    name: "Peanut Butter Swirl Brownie",
    slug: "peanut-butter-swirl-brownie",
    price: 5.99,
    compare_at_price: null,
    short_description: "Chocolate with creamy peanut butter swirls",
    gradient_from: "#92400E",
    gradient_to: "#451A03",
    is_featured: false,
    is_bestseller: false,
    protein_grams: 22,
    is_gluten_free: true,
    is_dairy_free: true,
    is_vegan: true,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 2, name: "Protein Brownies", slug: "protein-brownies", description: null, image_url: null, display_order: 2, is_active: true, created_at: "", updated_at: "" },
  },
  // Cookies
  {
    id: 6,
    name: "Chocolate Chip Protein Cookie",
    slug: "chocolate-chip-protein-cookie",
    price: 3.99,
    compare_at_price: null,
    short_description: "Classic soft-baked with chocolate chips",
    gradient_from: "#D97706",
    gradient_to: "#78350F",
    is_featured: false,
    is_bestseller: true,
    protein_grams: 16,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 3, name: "Protein Cookies", slug: "protein-cookies", description: null, image_url: null, display_order: 3, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 7,
    name: "Oatmeal Raisin Protein Cookie",
    slug: "oatmeal-raisin-protein-cookie",
    price: 3.49,
    compare_at_price: 3.99,
    short_description: "Hearty oatmeal with plump raisins",
    gradient_from: "#A16207",
    gradient_to: "#713F12",
    is_featured: false,
    is_bestseller: false,
    protein_grams: 14,
    is_gluten_free: false,
    is_dairy_free: true,
    is_vegan: true,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: true,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 3, name: "Protein Cookies", slug: "protein-cookies", description: null, image_url: null, display_order: 3, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 8,
    name: "Snickerdoodle Protein Cookie",
    slug: "snickerdoodle-protein-cookie",
    price: 3.99,
    compare_at_price: null,
    short_description: "Cinnamon sugar with soft chewy center",
    gradient_from: "#FBBF24",
    gradient_to: "#D97706",
    is_featured: true,
    is_bestseller: false,
    protein_grams: 15,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: true,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 3, name: "Protein Cookies", slug: "protein-cookies", description: null, image_url: null, display_order: 3, is_active: true, created_at: "", updated_at: "" },
  },
  // Protein Bars
  {
    id: 9,
    name: "Chocolate Brownie Protein Bar",
    slug: "chocolate-brownie-protein-bar",
    price: 4.49,
    compare_at_price: null,
    short_description: "Rich brownie flavor with chocolate coating",
    gradient_from: "#3F3F46",
    gradient_to: "#18181B",
    is_featured: false,
    is_bestseller: true,
    protein_grams: 25,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: true,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 4, name: "Protein Bars", slug: "protein-bars", description: null, image_url: null, display_order: 4, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 10,
    name: "Vanilla Peanut Butter Bar",
    slug: "vanilla-peanut-butter-bar",
    price: 4.49,
    compare_at_price: null,
    short_description: "Vanilla with peanut butter center",
    gradient_from: "#FEF3C7",
    gradient_to: "#92400E",
    is_featured: false,
    is_bestseller: false,
    protein_grams: 24,
    is_gluten_free: true,
    is_dairy_free: true,
    is_vegan: true,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 4, name: "Protein Bars", slug: "protein-bars", description: null, image_url: null, display_order: 4, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 11,
    name: "Mint Chocolate Protein Bar",
    slug: "mint-chocolate-protein-bar",
    price: 3.99,
    compare_at_price: 4.49,
    short_description: "Cool mint with dark chocolate",
    gradient_from: "#10B981",
    gradient_to: "#064E3B",
    is_featured: false,
    is_bestseller: false,
    protein_grams: 23,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: true,
    is_active: true,
    is_on_sale: true,
    is_in_stock: false, // Out of stock example
    primary_image_url: null,
    category: { id: 4, name: "Protein Bars", slug: "protein-bars", description: null, image_url: null, display_order: 4, is_active: true, created_at: "", updated_at: "" },
  },
  {
    id: 12,
    name: "Birthday Cake Protein Cupcake",
    slug: "birthday-cake-protein-cupcake",
    price: 7.99,
    compare_at_price: null,
    short_description: "Vanilla cake with rainbow sprinkles",
    gradient_from: "#EC4899",
    gradient_to: "#8B5CF6",
    is_featured: true,
    is_bestseller: false,
    protein_grams: 14,
    is_gluten_free: true,
    is_dairy_free: false,
    is_vegan: false,
    is_keto_friendly: false,
    is_active: true,
    is_on_sale: false,
    is_in_stock: true,
    primary_image_url: null,
    category: { id: 1, name: "Protein Cupcakes", slug: "protein-cupcakes", description: null, image_url: null, display_order: 1, is_active: true, created_at: "", updated_at: "" },
  },
];

/**
 * Get mock paginated products with filtering and sorting
 */
export function getMockProducts(params: {
  category?: string;
  search?: string;
  is_gluten_free?: boolean;
  is_dairy_free?: boolean;
  is_vegan?: boolean;
  is_keto_friendly?: boolean;
  sort_by?: string;
  sort_order?: string;
  page?: number;
  page_size?: number;
}): PaginatedProducts {
  let filtered = [...MOCK_PRODUCTS];

  // Filter by category
  if (params.category) {
    filtered = filtered.filter((p) => p.category?.slug === params.category);
  }

  // Filter by search
  if (params.search) {
    const search = params.search.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.name.toLowerCase().includes(search) ||
        p.short_description?.toLowerCase().includes(search)
    );
  }

  // Filter by dietary flags
  if (params.is_gluten_free) {
    filtered = filtered.filter((p) => p.is_gluten_free);
  }
  if (params.is_dairy_free) {
    filtered = filtered.filter((p) => p.is_dairy_free);
  }
  if (params.is_vegan) {
    filtered = filtered.filter((p) => p.is_vegan);
  }
  if (params.is_keto_friendly) {
    filtered = filtered.filter((p) => p.is_keto_friendly);
  }

  // Sort
  const sortBy = params.sort_by || "display_order";
  const sortOrder = params.sort_order || "asc";

  filtered.sort((a, b) => {
    let comparison = 0;
    switch (sortBy) {
      case "name":
        comparison = a.name.localeCompare(b.name);
        break;
      case "price":
        comparison = a.price - b.price;
        break;
      default:
        comparison = a.id - b.id;
    }
    return sortOrder === "desc" ? -comparison : comparison;
  });

  // Paginate
  const page = params.page || 1;
  const pageSize = params.page_size || 12;
  const start = (page - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    total: filtered.length,
    page,
    page_size: pageSize,
    total_pages: Math.ceil(filtered.length / pageSize),
  };
}

/**
 * Get a single mock product by slug
 */
export function getMockProductBySlug(slug: string): Product | null {
  const listItem = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!listItem) return null;

  // Extend with full product details
  return {
    ...listItem,
    sku: `SKU-${listItem.id.toString().padStart(3, "0")}`,
    description: `${listItem.short_description}. Made with premium ingredients and packed with ${listItem.protein_grams}g of protein per serving. Perfect for fitness enthusiasts who don't want to compromise on taste.`,
    stock_quantity: listItem.is_in_stock ? 25 : 0,
    low_stock_threshold: 5,
    track_inventory: true,
    allow_backorder: false,
    display_order: listItem.id,
    calories: Math.round((listItem.protein_grams || 15) * 10 + 100),
    meta_title: listItem.name,
    meta_description: listItem.short_description || "",
    category_id: listItem.category?.id || null,
    created_at: "2024-01-01T00:00:00Z",
    updated_at: "2024-01-01T00:00:00Z",
    is_low_stock: false,
    images: [],
  };
}
