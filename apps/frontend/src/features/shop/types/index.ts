/**
 * Shop feature types
 */

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: number;
  url: string;
  alt_text: string | null;
  display_order: number;
  is_primary: boolean;
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  sku: string;
  description: string;
  short_description: string | null;
  price: number;
  compare_at_price: number | null;
  stock_quantity: number;
  low_stock_threshold: number;
  track_inventory: boolean;
  allow_backorder: boolean;
  gradient_from: string | null;
  gradient_to: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
  display_order: number;
  protein_grams: number | null;
  calories: number | null;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_vegan: boolean;
  is_keto_friendly: boolean;
  is_active: boolean;
  meta_title: string | null;
  meta_description: string | null;
  category_id: number | null;
  created_at: string;
  updated_at: string;
  primary_image_url: string | null;
  is_on_sale: boolean;
  is_in_stock: boolean;
  is_low_stock: boolean;
  images: ProductImage[];
  category: Category | null;

  // Bakery-specific fields
  lead_time_hours: number;
  minimum_quantity: number;
  quantity_increment: number;
  allergens: string[] | null;
  is_seasonal: boolean;
  available_from: string | null;
  available_until: string | null;
  available_days: number[] | null;
  average_rating: number | null;
  review_count: number;
  is_currently_available: boolean;
}

export interface ProductListItem {
  id: number;
  name: string;
  slug: string;
  price: number;
  compare_at_price: number | null;
  short_description: string | null;
  gradient_from: string | null;
  gradient_to: string | null;
  is_featured: boolean;
  is_bestseller: boolean;
  protein_grams: number | null;
  is_gluten_free: boolean;
  is_dairy_free: boolean;
  is_vegan: boolean;
  is_keto_friendly: boolean;
  is_active: boolean;
  is_on_sale: boolean;
  is_in_stock: boolean;
  primary_image_url: string | null;
  category: Category | null;

  // Bakery-specific fields
  lead_time_hours: number;
  minimum_quantity: number;
  quantity_increment: number;
  allergens: string[] | null;
  average_rating: number | null;
  review_count: number;
}

export interface PaginatedProducts {
  items: ProductListItem[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface ProductFilters {
  category?: string;
  is_featured?: boolean;
  is_bestseller?: boolean;
  is_gluten_free?: boolean;
  is_dairy_free?: boolean;
  is_vegan?: boolean;
  is_keto_friendly?: boolean;
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: "name" | "price" | "created_at" | "display_order";
  sort_order?: "asc" | "desc";
  page?: number;
  page_size?: number;
}

// Server cart types
export interface ServerCartItem {
  id: number;
  product_id: number;
  quantity: number;
  unit_price: number;
  special_instructions: string | null;
  line_total: number;
  product: ProductListItem;
  created_at: string;
  updated_at: string;
}

export interface ServerCart {
  id: number;
  user_id: number | null;
  session_id: string | null;
  requested_delivery_date: string | null;
  delivery_time_slot: string | null;
  items: ServerCartItem[];
  item_count: number;
  subtotal: number;
  is_empty: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItemCreate {
  product_id: number;
  quantity: number;
  special_instructions?: string;
}

export interface CartItemUpdate {
  quantity?: number;
  special_instructions?: string;
}

export interface CartDeliveryUpdate {
  requested_delivery_date?: string;
  delivery_time_slot?: "morning" | "afternoon" | "evening";
}

export interface CartMergeRequest {
  session_id: string;
}

