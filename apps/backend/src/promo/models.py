"""Promo code model for discounts."""

from datetime import datetime
from decimal import Decimal
from enum import Enum as PyEnum

from sqlalchemy import (
    Boolean,
    DateTime,
    Enum,
    Integer,
    Numeric,
    String,
    Text,
)
from sqlalchemy.orm import Mapped, mapped_column

from src.database import Base


class DiscountType(str, PyEnum):
    """Type of discount."""
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"


class PromoCode(Base):
    """Promo code model for order discounts."""

    __tablename__ = "promo_codes"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    code: Mapped[str] = mapped_column(String(50), unique=True, index=True, nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    
    discount_type: Mapped[str] = mapped_column(
        Enum("percentage", "fixed_amount", name="discount_type_enum"),
        nullable=False,
    )
    discount_value: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    
    # Constraints
    minimum_order_value: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    maximum_discount: Mapped[Decimal | None] = mapped_column(
        Numeric(10, 2), nullable=True
    )
    usage_limit: Mapped[int | None] = mapped_column(Integer, nullable=True)
    usage_count: Mapped[int] = mapped_column(Integer, default=0, nullable=False)
    
    # Validity
    valid_from: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    valid_until: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True, nullable=False)
    
    # Timestamps
    created_at: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.utcnow, nullable=False
    )
    updated_at: Mapped[datetime | None] = mapped_column(DateTime, nullable=True)

    def is_valid(self) -> bool:
        """Check if promo code is currently valid."""
        if not self.is_active:
            return False
        
        now = datetime.utcnow()
        if self.valid_from and now < self.valid_from:
            return False
        if self.valid_until and now > self.valid_until:
            return False
        if self.usage_limit and self.usage_count >= self.usage_limit:
            return False
        
        return True

    def calculate_discount(self, order_total: Decimal) -> Decimal:
        """Calculate discount amount for an order."""
        if not self.is_valid():
            return Decimal(0)
        
        if self.minimum_order_value and order_total < self.minimum_order_value:
            return Decimal(0)
        
        if self.discount_type == "percentage":
            discount = order_total * (self.discount_value / 100)
        else:
            discount = self.discount_value
        
        # Cap at maximum discount if set
        if self.maximum_discount and discount > self.maximum_discount:
            discount = self.maximum_discount
        
        # Don't exceed order total
        if discount > order_total:
            discount = order_total
        
        return discount
