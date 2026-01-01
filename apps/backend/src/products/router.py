"""Product API routes."""

from decimal import Decimal
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.database import get_db
from src.products import service
from src.products.schemas import (
    CategoryResponse,
    PaginatedProducts,
    ProductFilters,
    ProductListResponse,
    ProductResponse,
)

router = APIRouter(prefix="/products", tags=["products"])


@router.get(
    "",
    response_model=PaginatedProducts,
    operation_id="listProducts",
)
async def list_products(
    db: Annotated[AsyncSession, Depends(get_db)],
    # Filters
    category: str | None = Query(None, description="Filter by category slug"),
    is_featured: bool | None = Query(None, description="Filter by featured status"),
    is_bestseller: bool | None = Query(None, description="Filter by bestseller status"),
    is_gluten_free: bool | None = Query(None, description="Filter by gluten-free"),
    is_dairy_free: bool | None = Query(None, description="Filter by dairy-free"),
    is_vegan: bool | None = Query(None, description="Filter by vegan"),
    is_keto_friendly: bool | None = Query(None, description="Filter by keto-friendly"),
    min_price: Decimal | None = Query(None, ge=0, description="Minimum price"),
    max_price: Decimal | None = Query(None, ge=0, description="Maximum price"),
    search: str | None = Query(None, description="Search in name and description"),
    # Sorting
    sort_by: str = Query(
        "display_order",
        description="Sort by field",
        pattern="^(name|price|created_at|display_order)$",
    ),
    sort_order: str = Query(
        "asc",
        description="Sort order",
        pattern="^(asc|desc)$",
    ),
    # Pagination
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(20, ge=1, le=100, description="Items per page"),
) -> PaginatedProducts:
    """List products with filtering, sorting, and pagination."""
    filters = ProductFilters(
        category_slug=category,
        is_featured=is_featured,
        is_bestseller=is_bestseller,
        is_gluten_free=is_gluten_free,
        is_dairy_free=is_dairy_free,
        is_vegan=is_vegan,
        is_keto_friendly=is_keto_friendly,
        min_price=min_price,
        max_price=max_price,
        search=search,
    )

    products, total = await service.get_products(
        db,
        filters=filters,
        sort_by=sort_by,
        sort_order=sort_order,
        page=page,
        page_size=page_size,
    )

    # Convert to list response
    items = [
        ProductListResponse(
            id=p.id,
            name=p.name,
            slug=p.slug,
            price=p.price,
            compare_at_price=p.compare_at_price,
            short_description=p.short_description,
            gradient_from=p.gradient_from,
            gradient_to=p.gradient_to,
            is_featured=p.is_featured,
            is_bestseller=p.is_bestseller,
            protein_grams=p.protein_grams,
            is_gluten_free=p.is_gluten_free,
            is_dairy_free=p.is_dairy_free,
            is_vegan=p.is_vegan,
            is_keto_friendly=p.is_keto_friendly,
            is_active=p.is_active,
            is_on_sale=p.is_on_sale,
            is_in_stock=p.is_in_stock,
            primary_image_url=p.primary_image_url,
            category=CategoryResponse.model_validate(p.category) if p.category else None,
        )
        for p in products
    ]

    total_pages = (total + page_size - 1) // page_size

    return PaginatedProducts(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.get(
    "/featured",
    response_model=list[ProductListResponse],
    operation_id="getFeaturedProducts",
)
async def get_featured_products(
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = Query(4, ge=1, le=20, description="Number of products to return"),
) -> list[ProductListResponse]:
    """Get featured products for homepage."""
    products = await service.get_featured_products(db, limit=limit)

    return [
        ProductListResponse(
            id=p.id,
            name=p.name,
            slug=p.slug,
            price=p.price,
            compare_at_price=p.compare_at_price,
            short_description=p.short_description,
            gradient_from=p.gradient_from,
            gradient_to=p.gradient_to,
            is_featured=p.is_featured,
            is_bestseller=p.is_bestseller,
            protein_grams=p.protein_grams,
            is_gluten_free=p.is_gluten_free,
            is_dairy_free=p.is_dairy_free,
            is_vegan=p.is_vegan,
            is_keto_friendly=p.is_keto_friendly,
            is_active=p.is_active,
            is_on_sale=p.is_on_sale,
            is_in_stock=p.is_in_stock,
            primary_image_url=p.primary_image_url,
            category=CategoryResponse.model_validate(p.category) if p.category else None,
        )
        for p in products
    ]


@router.get(
    "/bestsellers",
    response_model=list[ProductListResponse],
    operation_id="getBestsellerProducts",
)
async def get_bestseller_products(
    db: Annotated[AsyncSession, Depends(get_db)],
    limit: int = Query(4, ge=1, le=20, description="Number of products to return"),
) -> list[ProductListResponse]:
    """Get bestseller products."""
    products = await service.get_bestseller_products(db, limit=limit)

    return [
        ProductListResponse(
            id=p.id,
            name=p.name,
            slug=p.slug,
            price=p.price,
            compare_at_price=p.compare_at_price,
            short_description=p.short_description,
            gradient_from=p.gradient_from,
            gradient_to=p.gradient_to,
            is_featured=p.is_featured,
            is_bestseller=p.is_bestseller,
            protein_grams=p.protein_grams,
            is_gluten_free=p.is_gluten_free,
            is_dairy_free=p.is_dairy_free,
            is_vegan=p.is_vegan,
            is_keto_friendly=p.is_keto_friendly,
            is_active=p.is_active,
            is_on_sale=p.is_on_sale,
            is_in_stock=p.is_in_stock,
            primary_image_url=p.primary_image_url,
            category=CategoryResponse.model_validate(p.category) if p.category else None,
        )
        for p in products
    ]


@router.get(
    "/{slug}",
    response_model=ProductResponse,
    operation_id="getProduct",
)
async def get_product(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProductResponse:
    """Get a single product by slug."""
    product = await service.get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if not product.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    return ProductResponse.model_validate(product)


# ============ Categories Router ============

categories_router = APIRouter(prefix="/categories", tags=["categories"])


@categories_router.get(
    "",
    response_model=list[CategoryResponse],
    operation_id="listCategories",
)
async def list_categories(
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[CategoryResponse]:
    """List all active categories."""
    categories = await service.get_categories(db)
    return [CategoryResponse.model_validate(c) for c in categories]


@categories_router.get(
    "/{slug}",
    response_model=CategoryResponse,
    operation_id="getCategory",
)
async def get_category(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CategoryResponse:
    """Get a category by slug."""
    category = await service.get_category_by_slug(db, slug)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    if not category.is_active:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    return CategoryResponse.model_validate(category)
