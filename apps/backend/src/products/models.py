"""Product and Category models."""

from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, JSON, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.reviews.models import Review


class Category(Base):
    """Product category model."""

    __tablename__ = "categories"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    name: Mapped[str] = mapped_column(String(100), unique=True, nullable=False)
    slug: Mapped[str] = mapped_column(String(100), unique=True, nullable=False, index=True)
    description: Mapped[str | None] = mapped_column(Text)
    image_url: Mapped[str | None] = mapped_column(String(500))
    display_order: Mapped[int] = mapped_column(default=0)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    products: Mapped[list["Product"]] = relationship(back_populates="category")


class Product(Base):
    """Product model."""

    __tablename__ = "products"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    sku: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    name: Mapped[str] = mapped_column(String(200), nullable=False)
    slug: Mapped[str] = mapped_column(String(200), unique=True, nullable=False, index=True)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    short_description: Mapped[str | None] = mapped_column(String(500))

    # Pricing
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    compare_at_price: Mapped[Decimal | None] = mapped_column(Numeric(10, 2))

    # Inventory
    stock_quantity: Mapped[int] = mapped_column(default=0)
    low_stock_threshold: Mapped[int] = mapped_column(default=5)
    track_inventory: Mapped[bool] = mapped_column(default=True)
    allow_backorder: Mapped[bool] = mapped_column(default=False)

    # Display
    gradient_from: Mapped[str | None] = mapped_column(String(7))  # Hex color
    gradient_to: Mapped[str | None] = mapped_column(String(7))  # Hex color
    is_featured: Mapped[bool] = mapped_column(default=False, index=True)
    is_bestseller: Mapped[bool] = mapped_column(default=False, index=True)
    display_order: Mapped[int] = mapped_column(default=0)

    # Nutrition (protein treats specific)
    protein_grams: Mapped[int | None] = mapped_column()
    calories: Mapped[int | None] = mapped_column()

    # Dietary flags
    is_gluten_free: Mapped[bool] = mapped_column(default=True)
    is_dairy_free: Mapped[bool] = mapped_column(default=False)
    is_vegan: Mapped[bool] = mapped_column(default=False)
    is_keto_friendly: Mapped[bool] = mapped_column(default=False)

    # Bakery-specific: ordering constraints
    lead_time_hours: Mapped[int] = mapped_column(default=0)  # 0=same day, 24=next day
    minimum_quantity: Mapped[int] = mapped_column(default=1)  # Min order quantity
    quantity_increment: Mapped[int] = mapped_column(default=1)  # Order in multiples

    # Allergens (JSON array: ["milk", "eggs", "wheat", "nuts", "soy"])
    allergens: Mapped[list[str] | None] = mapped_column(JSON)

    # Availability windows
    is_seasonal: Mapped[bool] = mapped_column(default=False)
    available_from: Mapped[date | None] = mapped_column()
    available_until: Mapped[date | None] = mapped_column()
    available_days: Mapped[list[int] | None] = mapped_column(JSON)  # [0,1,2,3,4] = Mon-Fri

    # Reviews (cached for performance)
    average_rating: Mapped[Decimal | None] = mapped_column(Numeric(2, 1))
    review_count: Mapped[int] = mapped_column(default=0)

    # Status
    is_active: Mapped[bool] = mapped_column(default=True, index=True)

    # SEO
    meta_title: Mapped[str | None] = mapped_column(String(70))
    meta_description: Mapped[str | None] = mapped_column(String(160))

    # Relationships
    category_id: Mapped[int | None] = mapped_column(ForeignKey("categories.id"))
    category: Mapped["Category | None"] = relationship(back_populates="products")
    images: Mapped[list["ProductImage"]] = relationship(
        back_populates="product",
        order_by="ProductImage.display_order",
        cascade="all, delete-orphan",
    )
    reviews: Mapped[list["Review"]] = relationship(
        back_populates="product",
        cascade="all, delete-orphan",
    )

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    @property
    def primary_image_url(self) -> str | None:
        """Get the primary image URL."""
        for image in self.images:
            if image.is_primary:
                return image.url
        return self.images[0].url if self.images else None

    @property
    def is_on_sale(self) -> bool:
        """Check if product is on sale."""
        return self.compare_at_price is not None and self.compare_at_price > self.price

    @property
    def is_in_stock(self) -> bool:
        """Check if product is in stock."""
        if not self.track_inventory:
            return True
        return self.stock_quantity > 0 or self.allow_backorder

    @property
    def is_low_stock(self) -> bool:
        """Check if product is low on stock."""
        if not self.track_inventory:
            return False
        return self.stock_quantity <= self.low_stock_threshold

    @property
    def is_currently_available(self) -> bool:
        """Check if product is available based on seasonal dates."""
        if not self.is_seasonal:
            return True
        today = date.today()
        if self.available_from and today < self.available_from:
            return False
        if self.available_until and today > self.available_until:
            return False
        return True


class ProductImage(Base):
    """Product images model."""

    __tablename__ = "product_images"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE")
    )
    url: Mapped[str] = mapped_column(String(500), nullable=False)
    alt_text: Mapped[str | None] = mapped_column(String(255))
    display_order: Mapped[int] = mapped_column(default=0)
    is_primary: Mapped[bool] = mapped_column(default=False)

    # Relationships
    product: Mapped["Product"] = relationship(back_populates="images")
