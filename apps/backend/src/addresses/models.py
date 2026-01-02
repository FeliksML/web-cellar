"""Address database models."""

from datetime import datetime

from sqlalchemy import ForeignKey, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from src.database import Base


class Address(Base):
    """User address for shipping and billing."""

    __tablename__ = "addresses"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"), index=True
    )

    # Address type
    address_type: Mapped[str] = mapped_column(
        String(20), default="shipping"
    )  # shipping, billing
    is_default: Mapped[bool] = mapped_column(default=False)

    # Contact info
    first_name: Mapped[str] = mapped_column(String(100))
    last_name: Mapped[str] = mapped_column(String(100))
    phone: Mapped[str | None] = mapped_column(String(20))

    # Address fields
    address_line1: Mapped[str] = mapped_column(String(255))
    address_line2: Mapped[str | None] = mapped_column(String(255))
    city: Mapped[str] = mapped_column(String(100))
    state: Mapped[str] = mapped_column(String(50))
    postal_code: Mapped[str] = mapped_column(String(20))
    country: Mapped[str] = mapped_column(String(2), default="US")

    # Optional label and instructions
    label: Mapped[str | None] = mapped_column(String(50))  # "Home", "Work", etc.
    delivery_instructions: Mapped[str | None] = mapped_column(Text)

    # Timestamps
    created_at: Mapped[datetime] = mapped_column(default=datetime.utcnow)
    updated_at: Mapped[datetime] = mapped_column(
        default=datetime.utcnow, onupdate=datetime.utcnow
    )

    # Relationships
    user: Mapped["User"] = relationship(back_populates="addresses")  # noqa: F821

    @property
    def full_name(self) -> str:
        """Get the full name for the address."""
        return f"{self.first_name} {self.last_name}"

    @property
    def formatted_address(self) -> str:
        """Get a formatted single-line address."""
        parts = [self.address_line1]
        if self.address_line2:
            parts.append(self.address_line2)
        parts.append(f"{self.city}, {self.state} {self.postal_code}")
        return ", ".join(parts)
