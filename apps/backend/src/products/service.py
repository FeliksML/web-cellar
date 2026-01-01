"""Product service layer."""

from decimal import Decimal

from sqlalchemy import Select, func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.products.models import Category, Product, ProductImage
from src.products.schemas import (
    CategoryCreate,
    CategoryUpdate,
    ProductCreate,
    ProductFilters,
    ProductImageCreate,
    ProductUpdate,
)


# ============ Category Service ============


async def get_categories(
    db: AsyncSession,
    include_inactive: bool = False,
) -> list[Category]:
    """Get all categories."""
    query = select(Category).order_by(Category.display_order, Category.name)
    if not include_inactive:
        query = query.where(Category.is_active == True)  # noqa: E712
    result = await db.execute(query)
    return list(result.scalars().all())


async def get_category_by_id(db: AsyncSession, category_id: int) -> Category | None:
    """Get a category by ID."""
    result = await db.execute(select(Category).where(Category.id == category_id))
    return result.scalars().first()


async def get_category_by_slug(db: AsyncSession, slug: str) -> Category | None:
    """Get a category by slug."""
    result = await db.execute(select(Category).where(Category.slug == slug))
    return result.scalars().first()


async def create_category(db: AsyncSession, data: CategoryCreate) -> Category:
    """Create a new category."""
    category = Category(**data.model_dump())
    db.add(category)
    await db.flush()
    await db.refresh(category)
    return category


async def update_category(
    db: AsyncSession, category: Category, data: CategoryUpdate
) -> Category:
    """Update a category."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(category, field, value)
    await db.flush()
    await db.refresh(category)
    return category


async def delete_category(db: AsyncSession, category: Category) -> None:
    """Delete a category."""
    await db.delete(category)
    await db.flush()


# ============ Product Service ============


def _build_product_query(
    filters: ProductFilters | None = None,
    include_inactive: bool = False,
) -> Select:
    """Build product query with filters."""
    query = select(Product).options(
        selectinload(Product.images),
        selectinload(Product.category),
    )

    if not include_inactive:
        query = query.where(Product.is_active == True)  # noqa: E712

    if filters:
        if filters.category_slug:
            query = query.join(Category).where(Category.slug == filters.category_slug)
        if filters.is_featured is not None:
            query = query.where(Product.is_featured == filters.is_featured)
        if filters.is_bestseller is not None:
            query = query.where(Product.is_bestseller == filters.is_bestseller)
        if filters.is_gluten_free is not None:
            query = query.where(Product.is_gluten_free == filters.is_gluten_free)
        if filters.is_dairy_free is not None:
            query = query.where(Product.is_dairy_free == filters.is_dairy_free)
        if filters.is_vegan is not None:
            query = query.where(Product.is_vegan == filters.is_vegan)
        if filters.is_keto_friendly is not None:
            query = query.where(Product.is_keto_friendly == filters.is_keto_friendly)
        if filters.min_price is not None:
            query = query.where(Product.price >= filters.min_price)
        if filters.max_price is not None:
            query = query.where(Product.price <= filters.max_price)
        if filters.search:
            search_term = f"%{filters.search}%"
            query = query.where(
                (Product.name.ilike(search_term))
                | (Product.description.ilike(search_term))
                | (Product.short_description.ilike(search_term))
            )

    return query


async def get_products(
    db: AsyncSession,
    filters: ProductFilters | None = None,
    sort_by: str = "display_order",
    sort_order: str = "asc",
    page: int = 1,
    page_size: int = 20,
    include_inactive: bool = False,
) -> tuple[list[Product], int]:
    """Get products with filters, sorting, and pagination."""
    query = _build_product_query(filters, include_inactive)

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total_result = await db.execute(count_query)
    total = total_result.scalar() or 0

    # Apply sorting
    sort_column = getattr(Product, sort_by, Product.display_order)
    if sort_order == "desc":
        query = query.order_by(sort_column.desc())
    else:
        query = query.order_by(sort_column.asc())

    # Apply pagination
    offset = (page - 1) * page_size
    query = query.offset(offset).limit(page_size)

    result = await db.execute(query)
    products = list(result.scalars().unique().all())

    return products, total


async def get_featured_products(
    db: AsyncSession,
    limit: int = 4,
) -> list[Product]:
    """Get featured products for homepage."""
    query = (
        select(Product)
        .options(selectinload(Product.images), selectinload(Product.category))
        .where(Product.is_active == True)  # noqa: E712
        .where(Product.is_featured == True)  # noqa: E712
        .order_by(Product.display_order)
        .limit(limit)
    )
    result = await db.execute(query)
    return list(result.scalars().unique().all())


async def get_bestseller_products(
    db: AsyncSession,
    limit: int = 4,
) -> list[Product]:
    """Get bestseller products."""
    query = (
        select(Product)
        .options(selectinload(Product.images), selectinload(Product.category))
        .where(Product.is_active == True)  # noqa: E712
        .where(Product.is_bestseller == True)  # noqa: E712
        .order_by(Product.display_order)
        .limit(limit)
    )
    result = await db.execute(query)
    return list(result.scalars().unique().all())


async def get_product_by_id(db: AsyncSession, product_id: int) -> Product | None:
    """Get a product by ID."""
    query = (
        select(Product)
        .options(selectinload(Product.images), selectinload(Product.category))
        .where(Product.id == product_id)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def get_product_by_slug(db: AsyncSession, slug: str) -> Product | None:
    """Get a product by slug."""
    query = (
        select(Product)
        .options(selectinload(Product.images), selectinload(Product.category))
        .where(Product.slug == slug)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def get_product_by_sku(db: AsyncSession, sku: str) -> Product | None:
    """Get a product by SKU."""
    result = await db.execute(select(Product).where(Product.sku == sku))
    return result.scalars().first()


async def create_product(db: AsyncSession, data: ProductCreate) -> Product:
    """Create a new product."""
    product = Product(**data.model_dump())
    db.add(product)
    await db.flush()
    await db.refresh(product)
    return product


async def update_product(
    db: AsyncSession, product: Product, data: ProductUpdate
) -> Product:
    """Update a product."""
    update_data = data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(product, field, value)
    await db.flush()
    await db.refresh(product)
    return product


async def delete_product(db: AsyncSession, product: Product) -> None:
    """Delete a product (soft delete by setting is_active=False)."""
    product.is_active = False
    await db.flush()


async def hard_delete_product(db: AsyncSession, product: Product) -> None:
    """Permanently delete a product."""
    await db.delete(product)
    await db.flush()


async def update_stock(
    db: AsyncSession,
    product: Product,
    quantity_change: int,
) -> Product:
    """Update product stock quantity."""
    product.stock_quantity += quantity_change
    if product.stock_quantity < 0:
        product.stock_quantity = 0
    await db.flush()
    await db.refresh(product)
    return product


# ============ Product Image Service ============


async def add_product_image(
    db: AsyncSession,
    product: Product,
    data: ProductImageCreate,
) -> ProductImage:
    """Add an image to a product."""
    # If this is set as primary, unset other primary images
    if data.is_primary:
        for image in product.images:
            image.is_primary = False

    image = ProductImage(product_id=product.id, **data.model_dump())
    db.add(image)
    await db.flush()
    await db.refresh(image)
    return image


async def delete_product_image(db: AsyncSession, image: ProductImage) -> None:
    """Delete a product image."""
    await db.delete(image)
    await db.flush()


async def get_product_image_by_id(
    db: AsyncSession, image_id: int
) -> ProductImage | None:
    """Get a product image by ID."""
    result = await db.execute(select(ProductImage).where(ProductImage.id == image_id))
    return result.scalars().first()


async def set_primary_image(db: AsyncSession, product: Product, image_id: int) -> None:
    """Set an image as the primary image for a product."""
    for image in product.images:
        image.is_primary = image.id == image_id
    await db.flush()
