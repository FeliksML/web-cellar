"""Order Pydantic schemas."""

from datetime import date, datetime
from decimal import Decimal
from typing import Literal

from pydantic import BaseModel, EmailStr, Field


class OrderItemResponse(BaseModel):
    """Schema for order item response."""

    id: int
    product_id: int
    product_name: str
    product_sku: str
    quantity: int
    unit_price: Decimal
    subtotal: Decimal
    special_instructions: str | None
    created_at: datetime

    class Config:
        from_attributes = True


class AddressSnapshot(BaseModel):
    """Schema for address data stored in order."""

    first_name: str
    last_name: str
    phone: str | None
    address_line1: str
    address_line2: str | None
    city: str
    state: str
    postal_code: str
    country: str
    delivery_instructions: str | None = None


class OrderCreate(BaseModel):
    """Schema for creating an order from cart."""

    # Address
    shipping_address_id: int | None = None
    shipping_address: AddressSnapshot | None = None  # For guest checkout
    billing_address_id: int | None = None
    billing_same_as_shipping: bool = True

    # Fulfillment
    fulfillment_type: Literal["delivery", "pickup"] = "delivery"
    requested_date: date
    requested_time_slot: str | None = None

    # Contact
    contact_email: EmailStr
    contact_phone: str | None = None

    # Notes
    customer_notes: str | None = None

    # Payment
    payment_method: str = "stripe"
    stripe_payment_intent_id: str | None = None


class OrderResponse(BaseModel):
    """Schema for order response."""

    id: int
    order_number: str
    user_id: int | None
    status: str
    payment_status: str
    payment_method: str | None

    # Addresses
    shipping_address_snapshot: AddressSnapshot
    billing_address_snapshot: AddressSnapshot | None

    # Pricing
    subtotal: Decimal
    shipping_cost: Decimal
    tax_amount: Decimal
    discount_amount: Decimal
    total: Decimal

    # Fulfillment
    fulfillment_type: str
    requested_date: date
    requested_time_slot: str | None

    # Contact
    contact_email: str
    contact_phone: str | None

    # Notes
    customer_notes: str | None

    # Items
    items: list[OrderItemResponse]

    # Status flags
    is_cancellable: bool
    is_modifiable: bool

    # Timestamps
    confirmed_at: datetime | None
    preparing_at: datetime | None
    ready_at: datetime | None
    completed_at: datetime | None
    cancelled_at: datetime | None
    cancellation_reason: str | None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class OrderListResponse(BaseModel):
    """Simplified order for list views."""

    id: int
    order_number: str
    status: str
    payment_status: str
    fulfillment_type: str
    requested_date: date
    total: Decimal
    item_count: int
    created_at: datetime

    class Config:
        from_attributes = True


class OrderStatusUpdate(BaseModel):
    """Schema for updating order status."""

    status: Literal[
        "pending",
        "confirmed",
        "preparing",
        "ready",
        "out_for_delivery",
        "delivered",
        "picked_up",
        "cancelled",
    ]
    reason: str | None = None  # Required for cancellation


class OrderNotesUpdate(BaseModel):
    """Schema for updating order notes (admin)."""

    internal_notes: str | None = None


class OrderCancelRequest(BaseModel):
    """Schema for cancelling an order."""

    reason: str | None = None


class PaginatedOrders(BaseModel):
    """Paginated order list response."""

    items: list[OrderListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class OrderFilters(BaseModel):
    """Filters for listing orders."""

    status: str | None = None
    payment_status: str | None = None
    fulfillment_type: str | None = None
    date_from: date | None = None
    date_to: date | None = None
    search: str | None = None  # Order number or email
