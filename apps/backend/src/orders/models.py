"""Order database models."""

from datetime import date, datetime
from decimal import Decimal
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, Index, JSON, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.addresses.models import Address
    from src.auth.models import User
    from src.products.models import Product


class Order(Base):
    """Customer order."""

    __tablename__ = "orders"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_number: Mapped[str] = mapped_column(String(20), unique=True, index=True)
    user_id: Mapped[int | None] = mapped_column(
        ForeignKey("users.id", ondelete="SET NULL"), index=True
    )

    # Status workflow
    # pending -> confirmed -> preparing -> ready -> out_for_delivery -> delivered
    # pending -> confirmed -> preparing -> ready -> picked_up
    # pending -> cancelled
    status: Mapped[str] = mapped_column(String(30), default="pending", index=True)

    # Address references and snapshots
    shipping_address_id: Mapped[int | None] = mapped_column(
        ForeignKey("addresses.id", ondelete="SET NULL")
    )
    billing_address_id: Mapped[int | None] = mapped_column(
        ForeignKey("addresses.id", ondelete="SET NULL")
    )
    # Snapshots for historical accuracy (addresses may change)
    shipping_address_snapshot: Mapped[dict] = mapped_column(JSON)
    billing_address_snapshot: Mapped[dict | None] = mapped_column(JSON)

    # Pricing
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    shipping_cost: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    tax_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    discount_amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=0)
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    # Payment
    payment_status: Mapped[str] = mapped_column(
        String(30), default="pending"
    )  # pending, paid, refunded, failed
    payment_method: Mapped[str | None] = mapped_column(String(50))  # stripe, cash
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(100), index=True)

    # Bakery-specific: fulfillment
    fulfillment_type: Mapped[str] = mapped_column(
        String(20), default="delivery"
    )  # delivery, pickup
    requested_date: Mapped[date] = mapped_column(index=True)
    requested_time_slot: Mapped[str | None] = mapped_column(String(50))

    # Contact info (for guest orders or notifications)
    contact_email: Mapped[str] = mapped_column(String(255))
    contact_phone: Mapped[str | None] = mapped_column(String(20))

    # Notes
    customer_notes: Mapped[str | None] = mapped_column(Text)
    internal_notes: Mapped[str | None] = mapped_column(Text)  # Staff notes

    # Status timestamps
    confirmed_at: Mapped[datetime | None] = mapped_column()
    preparing_at: Mapped[datetime | None] = mapped_column()
    ready_at: Mapped[datetime | None] = mapped_column()
    completed_at: Mapped[datetime | None] = mapped_column()
    cancelled_at: Mapped[datetime | None] = mapped_column()
    cancellation_reason: Mapped[str | None] = mapped_column(Text)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user: Mapped["User | None"] = relationship(back_populates="orders")
    items: Mapped[list["OrderItem"]] = relationship(
        back_populates="order", cascade="all, delete-orphan", lazy="selectin"
    )
    shipping_address: Mapped["Address | None"] = relationship(
        foreign_keys=[shipping_address_id]
    )
    billing_address: Mapped["Address | None"] = relationship(
        foreign_keys=[billing_address_id]
    )

    __table_args__ = (
        Index("ix_orders_user_status", "user_id", "status"),
        Index("ix_orders_requested_date_status", "requested_date", "status"),
    )

    @property
    def is_cancellable(self) -> bool:
        """Check if the order can be cancelled."""
        return self.status in ("pending", "confirmed")

    @property
    def is_modifiable(self) -> bool:
        """Check if the order can be modified."""
        return self.status == "pending"


class OrderItem(Base):
    """Individual item in an order."""

    __tablename__ = "order_items"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    order_id: Mapped[int] = mapped_column(
        ForeignKey("orders.id", ondelete="CASCADE"), index=True
    )
    product_id: Mapped[int] = mapped_column(ForeignKey("products.id"), index=True)

    # Product snapshot (for historical accuracy)
    product_name: Mapped[str] = mapped_column(String(200))
    product_sku: Mapped[str] = mapped_column(String(50))
    product_snapshot: Mapped[dict] = mapped_column(JSON)

    # Quantity and pricing
    quantity: Mapped[int] = mapped_column()
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2))
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2))

    # Bakery-specific
    special_instructions: Mapped[str | None] = mapped_column(Text)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    order: Mapped["Order"] = relationship(back_populates="items")
    product: Mapped["Product"] = relationship()
