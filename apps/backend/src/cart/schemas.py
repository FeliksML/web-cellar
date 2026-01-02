"""Cart Pydantic schemas."""

from datetime import date, datetime
from decimal import Decimal

from pydantic import BaseModel, Field

from src.products.schemas import ProductListResponse


class CartItemBase(BaseModel):
    """Base cart item schema."""

    product_id: int
    quantity: int = Field(default=1, ge=1)
    special_instructions: str | None = None


class CartItemCreate(CartItemBase):
    """Schema for adding an item to cart."""

    pass


class CartItemUpdate(BaseModel):
    """Schema for updating a cart item."""

    quantity: int | None = Field(None, ge=1)
    special_instructions: str | None = None


class CartItemResponse(BaseModel):
    """Schema for cart item response."""

    id: int
    product_id: int
    quantity: int
    unit_price: Decimal
    special_instructions: str | None
    line_total: Decimal
    product: ProductListResponse
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CartDeliveryUpdate(BaseModel):
    """Schema for updating cart delivery preferences."""

    requested_delivery_date: date | None = None
    delivery_time_slot: str | None = Field(None, pattern="^(morning|afternoon|evening)$")


class CartResponse(BaseModel):
    """Schema for cart response."""

    id: int
    user_id: int | None
    session_id: str | None
    requested_delivery_date: date | None
    delivery_time_slot: str | None
    items: list[CartItemResponse]
    item_count: int
    subtotal: Decimal
    is_empty: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class CartMergeRequest(BaseModel):
    """Schema for merging a guest cart into a user cart."""

    session_id: str = Field(..., min_length=1)
