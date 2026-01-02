"""Payment-related Pydantic schemas."""

from decimal import Decimal

from pydantic import BaseModel


class PaymentIntentCreate(BaseModel):
    """Schema for creating a payment intent."""

    amount: Decimal
    currency: str = "usd"
    order_id: int | None = None


class PaymentIntentResponse(BaseModel):
    """Schema for payment intent response."""

    id: str
    client_secret: str
    amount: int  # in cents
    currency: str
    status: str


class RefundCreate(BaseModel):
    """Schema for creating a refund."""

    payment_intent_id: str
    amount: Decimal | None = None  # None for full refund
    reason: str = "requested_by_customer"


class RefundResponse(BaseModel):
    """Schema for refund response."""

    id: str
    amount: int  # in cents
    status: str
    reason: str | None
