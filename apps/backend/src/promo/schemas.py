"""Promo code Pydantic schemas."""

from datetime import datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, Field


class PromoCodeBase(BaseModel):
    """Base promo code fields."""
    code: str = Field(..., min_length=3, max_length=50)
    description: str | None = None
    discount_type: Literal["percentage", "fixed_amount"]
    discount_value: Decimal = Field(..., gt=0)
    minimum_order_value: Decimal | None = None
    maximum_discount: Decimal | None = None
    usage_limit: int | None = None
    valid_from: datetime | None = None
    valid_until: datetime | None = None
    is_active: bool = True


class PromoCodeCreate(PromoCodeBase):
    """Schema for creating a promo code."""
    pass


class PromoCodeUpdate(BaseModel):
    """Schema for updating a promo code."""
    code: str | None = Field(None, min_length=3, max_length=50)
    description: str | None = None
    discount_type: Literal["percentage", "fixed_amount"] | None = None
    discount_value: Decimal | None = Field(None, gt=0)
    minimum_order_value: Decimal | None = None
    maximum_discount: Decimal | None = None
    usage_limit: int | None = None
    valid_from: datetime | None = None
    valid_until: datetime | None = None
    is_active: bool | None = None


class PromoCodeResponse(BaseModel):
    """Full promo code response."""
    id: int
    code: str
    description: str | None
    discount_type: str
    discount_value: Decimal
    minimum_order_value: Decimal | None
    maximum_discount: Decimal | None
    usage_limit: int | None
    usage_count: int
    valid_from: datetime | None
    valid_until: datetime | None
    is_active: bool
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedPromoCodes(BaseModel):
    """Paginated promo codes response."""
    items: list[PromoCodeResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class PromoCodeValidation(BaseModel):
    """Response for validating a promo code."""
    valid: bool
    promo_code: PromoCodeResponse | None = None
    discount_amount: Decimal | None = None
    error: str | None = None
