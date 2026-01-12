"""Admin API routes for business settings."""

from typing import Annotated

from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentAdmin
from src.database import get_db


router = APIRouter(prefix="/admin/settings", tags=["admin-settings"])


# Settings model stored in database (you'd need to add a Settings table)
# For now, we'll use a simple in-memory/default approach

class BusinessSettings(BaseModel):
    """Business settings configuration."""
    # Store Info
    store_name: str = "Beasty Baker"
    store_tagline: str = "Delicious protein-packed treats"
    store_email: str = "hello@beastybaker.com"
    store_phone: str = ""
    store_address: str = ""
    
    # Order Settings
    minimum_order_value: float = 0
    delivery_fee: float = 5.00
    free_delivery_threshold: float = 50.00
    pickup_available: bool = True
    delivery_available: bool = True
    
    # Fulfillment Settings
    default_lead_time_hours: int = 24
    same_day_cutoff_hour: int = 12  # Orders before noon can be same-day
    available_time_slots: list[str] = Field(
        default_factory=lambda: ["9:00 AM - 12:00 PM", "12:00 PM - 3:00 PM", "3:00 PM - 6:00 PM"]
    )
    
    # Notification Settings
    order_notification_email: str = ""
    low_stock_notification_email: str = ""
    notify_on_new_order: bool = True
    notify_on_low_stock: bool = True


class SettingsUpdate(BaseModel):
    """Partial update for settings."""
    store_name: str | None = None
    store_tagline: str | None = None
    store_email: str | None = None
    store_phone: str | None = None
    store_address: str | None = None
    minimum_order_value: float | None = None
    delivery_fee: float | None = None
    free_delivery_threshold: float | None = None
    pickup_available: bool | None = None
    delivery_available: bool | None = None
    default_lead_time_hours: int | None = None
    same_day_cutoff_hour: int | None = None
    available_time_slots: list[str] | None = None
    order_notification_email: str | None = None
    low_stock_notification_email: str | None = None
    notify_on_new_order: bool | None = None
    notify_on_low_stock: bool | None = None


# In-memory settings storage (in production, use database)
_current_settings = BusinessSettings()


@router.get(
    "",
    response_model=BusinessSettings,
    operation_id="adminGetSettings",
)
async def get_settings(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> BusinessSettings:
    """Get current business settings."""
    return _current_settings


@router.put(
    "",
    response_model=BusinessSettings,
    operation_id="adminUpdateSettings",
)
async def update_settings(
    data: SettingsUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> BusinessSettings:
    """Update business settings."""
    global _current_settings
    
    update_dict = data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(_current_settings, field, value)
    
    return _current_settings


@router.post(
    "/reset",
    response_model=BusinessSettings,
    operation_id="adminResetSettings",
)
async def reset_settings(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> BusinessSettings:
    """Reset settings to defaults."""
    global _current_settings
    _current_settings = BusinessSettings()
    return _current_settings
