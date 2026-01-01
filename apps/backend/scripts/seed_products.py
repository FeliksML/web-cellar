"""Seed script for sample bakery products.

Run with: python -m scripts.seed_products
From the apps/backend directory.
"""

import asyncio
from decimal import Decimal

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker

from src.config import get_settings
from src.products.models import Category, Product, ProductImage


# Sample categories
CATEGORIES = [
    {
        "name": "Protein Cupcakes",
        "slug": "protein-cupcakes",
        "description": "Delicious high-protein cupcakes made with real ingredients.",
        "display_order": 1,
    },
    {
        "name": "Protein Brownies",
        "slug": "protein-brownies",
        "description": "Rich, fudgy brownies packed with protein.",
        "display_order": 2,
    },
    {
        "name": "Protein Cookies",
        "slug": "protein-cookies",
        "description": "Soft-baked protein cookies in amazing flavors.",
        "display_order": 3,
    },
    {
        "name": "Protein Bars",
        "slug": "protein-bars",
        "description": "On-the-go protein bars for busy lifestyles.",
        "display_order": 4,
    },
]

# Sample products with brand-matching gradients
PRODUCTS = [
    # Cupcakes
    {
        "sku": "CUP-BL-001",
        "name": "Blueberry Lemon Protein Cupcake",
        "slug": "blueberry-lemon-protein-cupcake",
        "description": "A zesty lemon cupcake bursting with fresh blueberries, topped with a light cream cheese frosting. Each cupcake delivers 15g of protein while satisfying your sweet cravings guilt-free.",
        "short_description": "Zesty lemon with fresh blueberries",
        "price": Decimal("6.99"),
        "compare_at_price": None,
        "stock_quantity": 24,
        "gradient_from": "#6366F1",
        "gradient_to": "#8B5CF6",
        "is_featured": True,
        "is_bestseller": True,
        "display_order": 1,
        "protein_grams": 15,
        "calories": 180,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": False,
        "category_slug": "protein-cupcakes",
    },
    {
        "sku": "CUP-PM-002",
        "name": "Pistachio Matcha Protein Cupcake",
        "slug": "pistachio-matcha-protein-cupcake",
        "description": "An earthy matcha base with crushed pistachios throughout, finished with a matcha cream frosting. This sophisticated cupcake offers 14g of protein and antioxidant benefits.",
        "short_description": "Earthy matcha with crushed pistachios",
        "price": Decimal("7.49"),
        "compare_at_price": None,
        "stock_quantity": 18,
        "gradient_from": "#39C78B",
        "gradient_to": "#E1CE71",
        "is_featured": True,
        "is_bestseller": False,
        "display_order": 2,
        "protein_grams": 14,
        "calories": 175,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": True,
        "category_slug": "protein-cupcakes",
    },
    {
        "sku": "CUP-AC-003",
        "name": "Apple Cinnamon Protein Cupcake",
        "slug": "apple-cinnamon-protein-cupcake",
        "description": "Warm cinnamon spice meets chunks of fresh apple in this comforting cupcake. Topped with a maple cream frosting for that perfect fall treat with 13g of protein.",
        "short_description": "Warm cinnamon with fresh apple chunks",
        "price": Decimal("5.99"),
        "compare_at_price": Decimal("6.99"),
        "stock_quantity": 30,
        "gradient_from": "#F59E0B",
        "gradient_to": "#B45309",
        "is_featured": False,
        "is_bestseller": True,
        "display_order": 3,
        "protein_grams": 13,
        "calories": 170,
        "is_gluten_free": True,
        "is_dairy_free": True,
        "is_vegan": False,
        "is_keto_friendly": False,
        "category_slug": "protein-cupcakes",
    },
    # Brownies
    {
        "sku": "BRW-DC-001",
        "name": "Double Chocolate Protein Brownie",
        "slug": "double-chocolate-protein-brownie",
        "description": "Intensely chocolatey with dark chocolate chips throughout. This fudgy brownie delivers 20g of protein and satisfies even the strongest chocolate cravings.",
        "short_description": "Intensely fudgy with dark chocolate chips",
        "price": Decimal("5.49"),
        "compare_at_price": None,
        "stock_quantity": 36,
        "gradient_from": "#44403C",
        "gradient_to": "#1C1917",
        "is_featured": True,
        "is_bestseller": True,
        "display_order": 1,
        "protein_grams": 20,
        "calories": 220,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": True,
        "category_slug": "protein-brownies",
    },
    {
        "sku": "BRW-PB-002",
        "name": "Peanut Butter Swirl Brownie",
        "slug": "peanut-butter-swirl-brownie",
        "description": "Rich chocolate brownie with ribbons of creamy peanut butter swirled throughout. A perfect balance of flavors with 22g of protein per serving.",
        "short_description": "Chocolate with creamy peanut butter swirls",
        "price": Decimal("5.99"),
        "compare_at_price": None,
        "stock_quantity": 28,
        "gradient_from": "#92400E",
        "gradient_to": "#451A03",
        "is_featured": False,
        "is_bestseller": False,
        "display_order": 2,
        "protein_grams": 22,
        "calories": 240,
        "is_gluten_free": True,
        "is_dairy_free": True,
        "is_vegan": True,
        "is_keto_friendly": False,
        "category_slug": "protein-brownies",
    },
    # Cookies
    {
        "sku": "COO-CC-001",
        "name": "Chocolate Chip Protein Cookie",
        "slug": "chocolate-chip-protein-cookie",
        "description": "Classic soft-baked chocolate chip cookie loaded with semi-sweet chocolate chips. Each cookie contains 16g of protein and tastes like the real thing.",
        "short_description": "Classic soft-baked with chocolate chips",
        "price": Decimal("3.99"),
        "compare_at_price": None,
        "stock_quantity": 48,
        "gradient_from": "#D97706",
        "gradient_to": "#78350F",
        "is_featured": False,
        "is_bestseller": True,
        "display_order": 1,
        "protein_grams": 16,
        "calories": 160,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": False,
        "category_slug": "protein-cookies",
    },
    {
        "sku": "COO-OA-002",
        "name": "Oatmeal Raisin Protein Cookie",
        "slug": "oatmeal-raisin-protein-cookie",
        "description": "Hearty oatmeal cookie studded with plump raisins and a hint of cinnamon. A nostalgic treat with 14g of protein per cookie.",
        "short_description": "Hearty oatmeal with plump raisins",
        "price": Decimal("3.49"),
        "compare_at_price": Decimal("3.99"),
        "stock_quantity": 40,
        "gradient_from": "#A16207",
        "gradient_to": "#713F12",
        "is_featured": False,
        "is_bestseller": False,
        "display_order": 2,
        "protein_grams": 14,
        "calories": 150,
        "is_gluten_free": False,
        "is_dairy_free": True,
        "is_vegan": True,
        "is_keto_friendly": False,
        "category_slug": "protein-cookies",
    },
    {
        "sku": "COO-SN-003",
        "name": "Snickerdoodle Protein Cookie",
        "slug": "snickerdoodle-protein-cookie",
        "description": "Buttery cookie rolled in cinnamon sugar with a soft, chewy center. This nostalgic favorite delivers 15g of protein.",
        "short_description": "Cinnamon sugar with soft chewy center",
        "price": Decimal("3.99"),
        "compare_at_price": None,
        "stock_quantity": 35,
        "gradient_from": "#FBBF24",
        "gradient_to": "#D97706",
        "is_featured": True,
        "is_bestseller": False,
        "display_order": 3,
        "protein_grams": 15,
        "calories": 155,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": True,
        "category_slug": "protein-cookies",
    },
    # Protein Bars
    {
        "sku": "BAR-CB-001",
        "name": "Chocolate Brownie Protein Bar",
        "slug": "chocolate-brownie-protein-bar",
        "description": "Dense, chewy bar with rich brownie flavor and chocolate coating. Perfect for post-workout with 25g of protein.",
        "short_description": "Rich brownie flavor with chocolate coating",
        "price": Decimal("4.49"),
        "compare_at_price": None,
        "stock_quantity": 60,
        "gradient_from": "#3F3F46",
        "gradient_to": "#18181B",
        "is_featured": False,
        "is_bestseller": True,
        "display_order": 1,
        "protein_grams": 25,
        "calories": 280,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": True,
        "category_slug": "protein-bars",
    },
    {
        "sku": "BAR-VP-002",
        "name": "Vanilla Peanut Butter Bar",
        "slug": "vanilla-peanut-butter-bar",
        "description": "Creamy vanilla base with a peanut butter center, dipped in white chocolate. Each bar packs 24g of protein.",
        "short_description": "Vanilla with peanut butter center",
        "price": Decimal("4.49"),
        "compare_at_price": None,
        "stock_quantity": 55,
        "gradient_from": "#FEF3C7",
        "gradient_to": "#92400E",
        "is_featured": False,
        "is_bestseller": False,
        "display_order": 2,
        "protein_grams": 24,
        "calories": 270,
        "is_gluten_free": True,
        "is_dairy_free": True,
        "is_vegan": True,
        "is_keto_friendly": False,
        "category_slug": "protein-bars",
    },
    {
        "sku": "BAR-MC-003",
        "name": "Mint Chocolate Protein Bar",
        "slug": "mint-chocolate-protein-bar",
        "description": "Cool mint meets rich dark chocolate in this refreshing protein bar. Contains 23g of protein for sustained energy.",
        "short_description": "Cool mint with dark chocolate",
        "price": Decimal("3.99"),
        "compare_at_price": Decimal("4.49"),
        "stock_quantity": 0,
        "gradient_from": "#10B981",
        "gradient_to": "#064E3B",
        "is_featured": False,
        "is_bestseller": False,
        "display_order": 3,
        "protein_grams": 23,
        "calories": 260,
        "is_gluten_free": True,
        "is_dairy_free": False,
        "is_vegan": False,
        "is_keto_friendly": True,
        "category_slug": "protein-bars",
    },
]


async def seed_database():
    """Seed the database with sample data."""
    settings = get_settings()
    engine = create_async_engine(settings.DATABASE_URL, echo=True)
    async_session = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

    async with async_session() as session:
        # Check if data already exists
        existing = await session.execute(select(Category).limit(1))
        if existing.scalar_one_or_none():
            print("Database already has data. Skipping seed.")
            return

        # Create categories
        category_map = {}
        for cat_data in CATEGORIES:
            category = Category(**cat_data)
            session.add(category)
            await session.flush()
            category_map[cat_data["slug"]] = category.id
            print(f"Created category: {cat_data['name']}")

        # Create products
        for prod_data in PRODUCTS:
            category_slug = prod_data.pop("category_slug")
            product = Product(
                **prod_data,
                category_id=category_map.get(category_slug),
            )
            session.add(product)
            await session.flush()
            print(f"Created product: {prod_data['name']}")

        await session.commit()
        print("\nSeeding complete!")
        print(f"Created {len(CATEGORIES)} categories and {len(PRODUCTS)} products.")


if __name__ == "__main__":
    asyncio.run(seed_database())
