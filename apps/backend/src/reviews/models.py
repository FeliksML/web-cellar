"""Review database models."""

from datetime import datetime
from typing import TYPE_CHECKING

from sqlalchemy import ForeignKey, String, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base

if TYPE_CHECKING:
    from src.auth.models import User
    from src.orders.models import OrderItem
    from src.products.models import Product


class Review(Base):
    """Product review from a customer."""

    __tablename__ = "reviews"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    product_id: Mapped[int] = mapped_column(
        ForeignKey("products.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )
    order_item_id: Mapped[int | None] = mapped_column(
        ForeignKey("order_items.id", ondelete="SET NULL")
    )  # For verified purchase badge

    # Review content
    rating: Mapped[int] = mapped_column()  # 1-5
    title: Mapped[str | None] = mapped_column(String(200))
    content: Mapped[str | None] = mapped_column(Text)

    # Moderation
    is_verified_purchase: Mapped[bool] = mapped_column(default=False)
    is_approved: Mapped[bool] = mapped_column(default=True)  # Auto-approve by default
    is_featured: Mapped[bool] = mapped_column(default=False)

    # Helpful votes
    helpful_count: Mapped[int] = mapped_column(default=0)

    # Business response
    response: Mapped[str | None] = mapped_column(Text)
    response_at: Mapped[datetime | None] = mapped_column()

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow, index=True)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    product: Mapped["Product"] = relationship(back_populates="reviews")
    user: Mapped["User"] = relationship(back_populates="reviews")
    order_item: Mapped["OrderItem | None"] = relationship()
    helpful_votes: Mapped[list["ReviewHelpful"]] = relationship(
        back_populates="review", cascade="all, delete-orphan"
    )

    __table_args__ = (
        # One review per user per product
        UniqueConstraint("user_id", "product_id", name="uq_review_user_product"),
    )


class ReviewHelpful(Base):
    """Track which users found which reviews helpful."""

    __tablename__ = "review_helpful"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    review_id: Mapped[int] = mapped_column(
        ForeignKey("reviews.id", ondelete="CASCADE"), index=True
    )
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)

    # Relationships
    review: Mapped["Review"] = relationship(back_populates="helpful_votes")

    __table_args__ = (
        UniqueConstraint("review_id", "user_id", name="uq_helpful_review_user"),
    )
