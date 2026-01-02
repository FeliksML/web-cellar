"""Address Pydantic schemas."""

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class AddressBase(BaseModel):
    """Base address schema with common fields."""

    address_type: Literal["shipping", "billing"] = "shipping"
    first_name: str = Field(..., min_length=1, max_length=100)
    last_name: str = Field(..., min_length=1, max_length=100)
    phone: str | None = Field(None, max_length=20)
    address_line1: str = Field(..., min_length=1, max_length=255)
    address_line2: str | None = Field(None, max_length=255)
    city: str = Field(..., min_length=1, max_length=100)
    state: str = Field(..., min_length=1, max_length=50)
    postal_code: str = Field(..., min_length=1, max_length=20)
    country: str = Field("US", min_length=2, max_length=2)
    label: str | None = Field(None, max_length=50)
    delivery_instructions: str | None = None
    is_default: bool = False


class AddressCreate(AddressBase):
    """Schema for creating a new address."""

    pass


class AddressUpdate(BaseModel):
    """Schema for updating an address. All fields optional."""

    address_type: Literal["shipping", "billing"] | None = None
    first_name: str | None = Field(None, min_length=1, max_length=100)
    last_name: str | None = Field(None, min_length=1, max_length=100)
    phone: str | None = Field(None, max_length=20)
    address_line1: str | None = Field(None, min_length=1, max_length=255)
    address_line2: str | None = Field(None, max_length=255)
    city: str | None = Field(None, min_length=1, max_length=100)
    state: str | None = Field(None, min_length=1, max_length=50)
    postal_code: str | None = Field(None, min_length=1, max_length=20)
    country: str | None = Field(None, min_length=2, max_length=2)
    label: str | None = Field(None, max_length=50)
    delivery_instructions: str | None = None
    is_default: bool | None = None


class AddressResponse(AddressBase):
    """Schema for address response."""

    id: int
    user_id: int
    full_name: str
    formatted_address: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
