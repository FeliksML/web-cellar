// Product admin types

export interface ProductListItem {
    id: number;
    sku: string;
    name: string;
    slug: string;
    price: number;
    compare_at_price: number | null;
    stock_quantity: number;
    is_active: boolean;
    is_featured: boolean;
    is_bestseller: boolean;
    category_id: number | null;
    category_name: string | null;
    primary_image_url: string | null;
    created_at: string;
}

export interface ProductFilters {
    page?: number;
    page_size?: number;
    search?: string | null;
    is_active?: boolean | null;
    category_id?: number | null;
}

export interface PaginatedProducts {
    items: ProductListItem[];
    total: number;
    page: number;
    page_size: number;
    total_pages: number;
}

export interface Category {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    image_url: string | null;
    display_order: number;
    is_active: boolean;
}

export interface ProductCreate {
    sku: string;
    name: string;
    description: string;
    short_description?: string | null;
    price: number;
    compare_at_price?: number | null;
    stock_quantity: number;
    low_stock_threshold?: number;
    category_id?: number | null;
    is_active?: boolean;
    is_featured?: boolean;
    is_bestseller?: boolean;
    is_gluten_free?: boolean;
    is_dairy_free?: boolean;
    is_vegan?: boolean;
    is_keto_friendly?: boolean;
    lead_time_hours?: number;
    minimum_quantity?: number;
    quantity_increment?: number;
    allergens?: string[];
    is_seasonal?: boolean;
    available_from?: string | null;
    available_until?: string | null;
    meta_title?: string | null;
    meta_description?: string | null;
    gradient_from?: string | null;
    gradient_to?: string | null;
}

export interface ProductUpdate extends Partial<ProductCreate> { }

