"""Address management domain."""

from src.addresses.models import Address
from src.addresses.router import router

__all__ = ["Address", "router"]
