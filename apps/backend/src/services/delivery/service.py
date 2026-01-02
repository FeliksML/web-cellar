"""Delivery scheduling service."""

from datetime import date, datetime, timedelta
from typing import NamedTuple

from src.config import get_settings


class TimeSlot(NamedTuple):
    """Delivery time slot."""

    id: str
    label: str
    start_hour: int
    end_hour: int


class DeliveryService:
    """Service for managing delivery schedules and time slots."""

    TIME_SLOTS = [
        TimeSlot("morning", "Morning (9am - 12pm)", 9, 12),
        TimeSlot("afternoon", "Afternoon (12pm - 5pm)", 12, 17),
        TimeSlot("evening", "Evening (5pm - 8pm)", 17, 20),
    ]

    def __init__(self):
        self.settings = get_settings()
        self.cutoff_hour = self.settings.ORDER_CUTOFF_HOUR

    def get_available_dates(
        self,
        lead_time_hours: int = 0,
        days_ahead: int = 14,
        available_days: list[int] | None = None,
    ) -> list[date]:
        """
        Get available delivery dates.

        Args:
            lead_time_hours: Minimum hours before delivery (e.g., 24 for next-day)
            days_ahead: How many days to show
            available_days: List of weekdays (0=Mon, 6=Sun). None for all days.

        Returns:
            List of available dates
        """
        today = date.today()
        now = datetime.now()

        # Calculate earliest date based on lead time
        hours_until_delivery = lead_time_hours
        if now.hour >= self.cutoff_hour:
            # After cutoff, add a day
            hours_until_delivery += 24

        days_from_now = (hours_until_delivery + 23) // 24  # Round up to days
        earliest = today + timedelta(days=days_from_now)

        dates = []
        for i in range(days_ahead):
            check_date = earliest + timedelta(days=i)
            weekday = check_date.weekday()

            # Check if day is available
            if available_days is None or weekday in available_days:
                dates.append(check_date)

        return dates

    def get_available_time_slots(
        self,
        delivery_date: date,
    ) -> list[TimeSlot]:
        """
        Get available time slots for a specific date.

        Args:
            delivery_date: The delivery date

        Returns:
            List of available time slots
        """
        today = date.today()
        now = datetime.now()

        if delivery_date < today:
            return []

        if delivery_date == today:
            # Filter out past time slots (with buffer)
            buffer_hours = 2
            return [
                slot
                for slot in self.TIME_SLOTS
                if slot.start_hour > now.hour + buffer_hours
            ]

        return list(self.TIME_SLOTS)

    def validate_delivery_date(
        self,
        requested_date: date,
        lead_time_hours: int = 0,
        available_days: list[int] | None = None,
    ) -> tuple[bool, str | None]:
        """
        Validate a requested delivery date.

        Args:
            requested_date: The date to validate
            lead_time_hours: Minimum hours before delivery
            available_days: Allowed weekdays

        Returns:
            Tuple of (is_valid, error_message)
        """
        available = self.get_available_dates(lead_time_hours, 30, available_days)

        if not available:
            return False, "No delivery dates available"

        if requested_date < available[0]:
            days_notice = lead_time_hours // 24
            return False, f"This item requires {days_notice} days advance notice"

        if available_days and requested_date.weekday() not in available_days:
            return False, "Delivery not available on this day"

        return True, None

    def validate_time_slot(
        self,
        delivery_date: date,
        time_slot: str,
    ) -> tuple[bool, str | None]:
        """
        Validate a requested time slot.

        Args:
            delivery_date: The delivery date
            time_slot: The time slot ID

        Returns:
            Tuple of (is_valid, error_message)
        """
        available = self.get_available_time_slots(delivery_date)
        available_ids = [slot.id for slot in available]

        if time_slot not in available_ids:
            return False, "Time slot not available"

        return True, None

    def calculate_shipping_cost(
        self,
        postal_code: str,
        order_total: float,
    ) -> float:
        """
        Calculate shipping cost based on location and order total.

        Args:
            postal_code: Delivery postal code
            order_total: Order subtotal

        Returns:
            Shipping cost in dollars
        """
        # Free shipping over $50
        if order_total >= 50:
            return 0.0

        # Basic flat rate shipping
        # TODO: Implement zone-based pricing if needed
        return 5.99


# Singleton instance
_delivery_service: DeliveryService | None = None


def get_delivery_service() -> DeliveryService:
    """Get or create the Delivery service singleton."""
    global _delivery_service
    if _delivery_service is None:
        _delivery_service = DeliveryService()
    return _delivery_service
