"""Inventory management service."""

from sqlalchemy import update
from sqlalchemy.ext.asyncio import AsyncSession

from src.products.models import Product


class InventoryService:
    """Service for managing product inventory."""

    def __init__(self, db: AsyncSession):
        self.db = db

    async def check_availability(
        self,
        product_id: int,
        quantity: int,
    ) -> tuple[bool, str | None]:
        """
        Check if a product is available in the requested quantity.

        Args:
            product_id: Product ID to check
            quantity: Requested quantity

        Returns:
            Tuple of (is_available, error_message)
        """
        product = await self.db.get(Product, product_id)
        if not product:
            return False, "Product not found"

        if not product.is_active:
            return False, "Product is not available"

        if product.track_inventory:
            if product.stock_quantity < quantity:
                if not product.allow_backorder:
                    if product.stock_quantity == 0:
                        return False, "Product is out of stock"
                    return False, f"Only {product.stock_quantity} available"

        return True, None

    async def reserve_stock(
        self,
        product_id: int,
        quantity: int,
    ) -> bool:
        """
        Reserve stock for an order by decrementing quantity.

        Args:
            product_id: Product ID
            quantity: Quantity to reserve

        Returns:
            True if successful, False if not enough stock
        """
        result = await self.db.execute(
            update(Product)
            .where(Product.id == product_id)
            .where(Product.stock_quantity >= quantity)
            .values(stock_quantity=Product.stock_quantity - quantity)
        )
        await self.db.commit()
        return result.rowcount > 0

    async def release_stock(
        self,
        product_id: int,
        quantity: int,
    ) -> None:
        """
        Release reserved stock (e.g., for cancelled orders).

        Args:
            product_id: Product ID
            quantity: Quantity to release
        """
        await self.db.execute(
            update(Product)
            .where(Product.id == product_id)
            .values(stock_quantity=Product.stock_quantity + quantity)
        )
        await self.db.commit()

    async def get_low_stock_products(
        self,
        threshold: int | None = None,
    ) -> list[Product]:
        """
        Get products that are low on stock.

        Args:
            threshold: Optional override for low stock threshold

        Returns:
            List of products with low stock
        """
        from sqlalchemy import select

        query = (
            select(Product)
            .where(Product.is_active.is_(True))
            .where(Product.track_inventory.is_(True))
        )

        if threshold is not None:
            query = query.where(Product.stock_quantity <= threshold)
        else:
            # Use each product's own threshold
            query = query.where(Product.stock_quantity <= Product.low_stock_threshold)

        result = await self.db.execute(query)
        return list(result.scalars().all())

    async def update_stock(
        self,
        product_id: int,
        new_quantity: int,
    ) -> Product | None:
        """
        Set stock to a specific quantity.

        Args:
            product_id: Product ID
            new_quantity: New stock quantity

        Returns:
            Updated product or None if not found
        """
        product = await self.db.get(Product, product_id)
        if not product:
            return None

        product.stock_quantity = new_quantity
        await self.db.commit()
        await self.db.refresh(product)
        return product
