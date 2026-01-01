"""Product and Category schemas."""

from datetime import datetime
from decimal import Decimal

from pydantic import BaseModel, Field


# ============ Category Schemas ============


class CategoryBase(BaseModel):
    """Base category schema."""

    name: str = Field(..., min_length=1, max_length=100)
    slug: str = Field(..., min_length=1, max_length=100)
    description: str | None = None
    image_url: str | None = None
    display_order: int = 0
    is_active: bool = True


class CategoryCreate(CategoryBase):
    """Schema for creating a category."""

    pass


class CategoryUpdate(BaseModel):
    """Schema for updating a category."""

    name: str | None = Field(None, min_length=1, max_length=100)
    slug: str | None = Field(None, min_length=1, max_length=100)
    description: str | None = None
    image_url: str | None = None
    display_order: int | None = None
    is_active: bool | None = None


class CategoryResponse(CategoryBase):
    """Schema for category response."""

    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CategoryWithProductCount(CategoryResponse):
    """Category with product count."""

    product_count: int = 0


# ============ Product Image Schemas ============


class ProductImageBase(BaseModel):
    """Base product image schema."""

    url: str = Field(..., max_length=500)
    alt_text: str | None = Field(None, max_length=255)
    display_order: int = 0
    is_primary: bool = False


class ProductImageCreate(ProductImageBase):
    """Schema for creating a product image."""

    pass


class ProductImageResponse(ProductImageBase):
    """Schema for product image response."""

    id: int

    class Config:
        from_attributes = True


# ============ Product Schemas ============


class ProductBase(BaseModel):
    """Base product schema."""

    name: str = Field(..., min_length=1, max_length=200)
    slug: str = Field(..., min_length=1, max_length=200)
    sku: str = Field(..., min_length=1, max_length=50)
    description: str = Field(..., min_length=1)
    short_description: str | None = Field(None, max_length=500)

    # Pricing
    price: Decimal = Field(..., ge=0, decimal_places=2)
    compare_at_price: Decimal | None = Field(None, ge=0, decimal_places=2)

    # Inventory
    stock_quantity: int = Field(default=0, ge=0)
    low_stock_threshold: int = Field(default=5, ge=0)
    track_inventory: bool = True
    allow_backorder: bool = False

    # Display
    gradient_from: str | None = Field(None, max_length=7)
    gradient_to: str | None = Field(None, max_length=7)
    is_featured: bool = False
    is_bestseller: bool = False
    display_order: int = 0

    # Nutrition
    protein_grams: int | None = Field(None, ge=0)
    calories: int | None = Field(None, ge=0)

    # Dietary flags
    is_gluten_free: bool = True
    is_dairy_free: bool = False
    is_vegan: bool = False
    is_keto_friendly: bool = False

    # Status
    is_active: bool = True

    # SEO
    meta_title: str | None = Field(None, max_length=70)
    meta_description: str | None = Field(None, max_length=160)

    # Category
    category_id: int | None = None


class ProductCreate(ProductBase):
    """Schema for creating a product."""

    pass


class ProductUpdate(BaseModel):
    """Schema for updating a product."""

    name: str | None = Field(None, min_length=1, max_length=200)
    slug: str | None = Field(None, min_length=1, max_length=200)
    sku: str | None = Field(None, min_length=1, max_length=50)
    description: str | None = None
    short_description: str | None = None

    price: Decimal | None = Field(None, ge=0)
    compare_at_price: Decimal | None = Field(None, ge=0)

    stock_quantity: int | None = Field(None, ge=0)
    low_stock_threshold: int | None = Field(None, ge=0)
    track_inventory: bool | None = None
    allow_backorder: bool | None = None

    gradient_from: str | None = None
    gradient_to: str | None = None
    is_featured: bool | None = None
    is_bestseller: bool | None = None
    display_order: int | None = None

    protein_grams: int | None = None
    calories: int | None = None

    is_gluten_free: bool | None = None
    is_dairy_free: bool | None = None
    is_vegan: bool | None = None
    is_keto_friendly: bool | None = None

    is_active: bool | None = None

    meta_title: str | None = None
    meta_description: str | None = None

    category_id: int | None = None


class ProductResponse(ProductBase):
    """Schema for product response."""

    id: int
    created_at: datetime
    updated_at: datetime

    # Computed properties
    primary_image_url: str | None = None
    is_on_sale: bool = False
    is_in_stock: bool = True
    is_low_stock: bool = False

    # Related data
    images: list[ProductImageResponse] = []
    category: CategoryResponse | None = None

    class Config:
        from_attributes = True


class ProductListResponse(BaseModel):
    """Schema for product list response."""

    id: int
    name: str
    slug: str
    price: Decimal
    compare_at_price: Decimal | None = None
    short_description: str | None = None

    # Display
    gradient_from: str | None = None
    gradient_to: str | None = None
    is_featured: bool = False
    is_bestseller: bool = False

    # Nutrition
    protein_grams: int | None = None

    # Dietary flags
    is_gluten_free: bool = True
    is_dairy_free: bool = False
    is_vegan: bool = False
    is_keto_friendly: bool = False

    # Status
    is_active: bool = True
    is_on_sale: bool = False
    is_in_stock: bool = True

    # Image
    primary_image_url: str | None = None

    # Category
    category: CategoryResponse | None = None

    class Config:
        from_attributes = True


# ============ Query Parameters ============


class ProductFilters(BaseModel):
    """Product filter parameters."""

    category_slug: str | None = None
    is_featured: bool | None = None
    is_bestseller: bool | None = None
    is_gluten_free: bool | None = None
    is_dairy_free: bool | None = None
    is_vegan: bool | None = None
    is_keto_friendly: bool | None = None
    min_price: Decimal | None = None
    max_price: Decimal | None = None
    search: str | None = None


class ProductSort(BaseModel):
    """Product sort options."""

    sort_by: str = "display_order"  # name, price, created_at, display_order
    sort_order: str = "asc"  # asc, desc


class PaginatedProducts(BaseModel):
    """Paginated product list response."""

    items: list[ProductListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
