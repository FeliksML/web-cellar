"""Cart database models."""

from datetime import date, datetime, timedelta
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.auth.models import User
    from src.products.models import Product


class Cart(Base):
    """Shopping cart that supports both authenticated users and guests."""

    __tablename__ = "carts"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    # User-based cart (for authenticated users)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True, unique=True
    )

    # Session-based cart (for guests)
    session_id: Mapped[str | None] = mapped_column(String(100), index=True, unique=True)

    # Bakery-specific: requested delivery preferences
    requested_delivery_date: Mapped[date | None] = mapped_column()
    delivery_time_slot: Mapped[str | None] = mapped_column(
        String(50)
    )  # "morning", "afternoon", "evening"

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )
    expires_at: Mapped[datetime | None] = mapped_column()  # For guest cart cleanup

    # Relationships
    user: Mapped["User | None"] = relationship(back_populates="cart")
    items: Mapped[list["CartItem"]] = relationship(
        back_populates="cart", cascade="all, delete-orphan", lazy="selectin"
    )

    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Set expiration for guest carts (7 days)
        if self.session_id and not self.expires_at:
            self.expires_at = datetime.utcnow() + timedelta(days=7)

    @property
    def item_count(self) -> int:
        """Get total number of items in cart."""
        return sum(item.quantity for item in self.items)

    @property
    def subtotal(self) -> Decimal:
        """Calculate cart subtotal."""
        return sum(item.line_total for item in self.items)

    @property
    def is_empty(self) -> bool:
        """Check if cart is empty."""
        return len(self.items) == 0


class CartItem(Base):
    """Individual item in a shopping cart."""

    __tablename__ = "cart_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    cart_id: Mapped[int] = mapped_column(
        ForeignKey("carts.id", ondelete="CASCADE"), index=True
    )
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)

    quantity: Mapped[int] = mapped_column(default=1)

    # Price snapshot at time of adding (for price consistency)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    # Bakery-specific: special instructions for this item
    special_instructions: Mapped[str | None] = mapped_column(
        Text
    )  # "Happy Birthday John!"

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    cart: Mapped["Cart"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship(lazy="selectin")

    @property
    def line_total(self) -> Decimal:
        """Calculate line item total."""
        return self.unit_price * self.quantity
