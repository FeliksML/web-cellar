"""Products domain - Product catalog management."""

from src.products.admin_router import router as admin_router
from src.products.models import Category, Product, ProductImage
from src.products.router import categories_router, router

__all__ = [
    "Category",
    "Product",
    "ProductImage",
    "router",
    "categories_router",
    "admin_router",
]
