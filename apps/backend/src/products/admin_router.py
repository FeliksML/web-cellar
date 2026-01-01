"""Admin API routes for products."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentAdmin
from src.database import get_db
from src.products import service
from src.products.schemas import (
    CategoryCreate,
    CategoryResponse,
    CategoryUpdate,
    PaginatedProducts,
    ProductCreate,
    ProductImageCreate,
    ProductImageResponse,
    ProductListResponse,
    ProductResponse,
    ProductUpdate,
)

router = APIRouter(prefix="/admin", tags=["admin"])


# ============ Product Admin Routes ============


@router.get(
    "/products",
    response_model=PaginatedProducts,
    operation_id="adminListProducts",
)
async def list_products(
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    search: str | None = None,
    is_active: bool | None = None,
) -> PaginatedProducts:
    """List all products (including inactive) for admin."""
    from src.products.schemas import ProductFilters

    filters = ProductFilters(search=search)

    products, total = await service.get_products(
        db,
        filters=filters,
        page=page,
        page_size=page_size,
        include_inactive=True,
    )

    # Filter by active status if specified
    if is_active is not None:
        products = [p for p in products if p.is_active == is_active]

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
            category=None,
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
    "/products/{product_id}",
    response_model=ProductResponse,
    operation_id="adminGetProduct",
)
async def get_product(
    product_id: int,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProductResponse:
    """Get a product by ID (including inactive)."""
    product = await service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )
    return ProductResponse.model_validate(product)


@router.post(
    "/products",
    response_model=ProductResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="adminCreateProduct",
)
async def create_product(
    data: ProductCreate,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProductResponse:
    """Create a new product."""
    # Check for duplicate SKU
    existing = await service.get_product_by_sku(db, data.sku)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this SKU already exists",
        )

    # Check for duplicate slug
    existing_slug = await service.get_product_by_slug(db, data.slug)
    if existing_slug:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Product with this slug already exists",
        )

    # Validate category exists if provided
    if data.category_id:
        category = await service.get_category_by_id(db, data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found",
            )

    product = await service.create_product(db, data)

    # Reload with relationships
    product = await service.get_product_by_id(db, product.id)
    return ProductResponse.model_validate(product)


@router.put(
    "/products/{product_id}",
    response_model=ProductResponse,
    operation_id="adminUpdateProduct",
)
async def update_product(
    product_id: int,
    data: ProductUpdate,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProductResponse:
    """Update a product."""
    product = await service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    # Check for duplicate SKU if changing
    if data.sku and data.sku != product.sku:
        existing = await service.get_product_by_sku(db, data.sku)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this SKU already exists",
            )

    # Check for duplicate slug if changing
    if data.slug and data.slug != product.slug:
        existing = await service.get_product_by_slug(db, data.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Product with this slug already exists",
            )

    # Validate category exists if changing
    if data.category_id:
        category = await service.get_category_by_id(db, data.category_id)
        if not category:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category not found",
            )

    product = await service.update_product(db, product, data)

    # Reload with relationships
    product = await service.get_product_by_id(db, product.id)
    return ProductResponse.model_validate(product)


@router.delete(
    "/products/{product_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="adminDeleteProduct",
)
async def delete_product(
    product_id: int,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    hard_delete: bool = Query(False, description="Permanently delete the product"),
) -> None:
    """Delete a product (soft delete by default)."""
    product = await service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    if hard_delete:
        await service.hard_delete_product(db, product)
    else:
        await service.delete_product(db, product)


# ============ Product Image Admin Routes ============


@router.post(
    "/products/{product_id}/images",
    response_model=ProductImageResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="adminAddProductImage",
)
async def add_product_image(
    product_id: int,
    data: ProductImageCreate,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ProductImageResponse:
    """Add an image to a product."""
    product = await service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    image = await service.add_product_image(db, product, data)
    return ProductImageResponse.model_validate(image)


@router.delete(
    "/products/{product_id}/images/{image_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="adminDeleteProductImage",
)
async def delete_product_image(
    product_id: int,
    image_id: int,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Delete a product image."""
    product = await service.get_product_by_id(db, product_id)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    image = await service.get_product_image_by_id(db, image_id)
    if not image or image.product_id != product_id:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Image not found",
        )

    await service.delete_product_image(db, image)


# ============ Category Admin Routes ============


@router.get(
    "/categories",
    response_model=list[CategoryResponse],
    operation_id="adminListCategories",
)
async def list_categories(
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> list[CategoryResponse]:
    """List all categories (including inactive)."""
    categories = await service.get_categories(db, include_inactive=True)
    return [CategoryResponse.model_validate(c) for c in categories]


@router.post(
    "/categories",
    response_model=CategoryResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="adminCreateCategory",
)
async def create_category(
    data: CategoryCreate,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CategoryResponse:
    """Create a new category."""
    # Check for duplicate slug
    existing = await service.get_category_by_slug(db, data.slug)
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Category with this slug already exists",
        )

    category = await service.create_category(db, data)
    return CategoryResponse.model_validate(category)


@router.put(
    "/categories/{category_id}",
    response_model=CategoryResponse,
    operation_id="adminUpdateCategory",
)
async def update_category(
    category_id: int,
    data: CategoryUpdate,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> CategoryResponse:
    """Update a category."""
    category = await service.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    # Check for duplicate slug if changing
    if data.slug and data.slug != category.slug:
        existing = await service.get_category_by_slug(db, data.slug)
        if existing:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Category with this slug already exists",
            )

    category = await service.update_category(db, category, data)
    return CategoryResponse.model_validate(category)


@router.delete(
    "/categories/{category_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="adminDeleteCategory",
)
async def delete_category(
    category_id: int,
    admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Delete a category."""
    category = await service.get_category_by_id(db, category_id)
    if not category:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Category not found",
        )

    await service.delete_category(db, category)
