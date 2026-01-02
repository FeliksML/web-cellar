"""Cart dependencies for dependency injection."""

from typing import Annotated

from fastapi import Cookie, Depends, Header
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import get_current_user
from src.auth.models import User
from src.cart.models import Cart
from src.cart.service import get_or_create_cart
from src.database import get_db


async def get_optional_current_user(
    token: Annotated[str | None, Header(alias="Authorization")] = None,
    db: Annotated[AsyncSession, Depends(get_db)] = None,
) -> User | None:
    """Get the current user if authenticated, None otherwise."""
    if not token or not token.startswith("Bearer "):
        return None

    try:
        # Extract token and validate
        from src.auth.security import decode_access_token
        from src.auth.service import get_user_by_id

        token_str = token.split(" ")[1]
        token_data = decode_access_token(token_str)
        if token_data is None or token_data.user_id is None:
            return None

        user = await get_user_by_id(db, token_data.user_id)
        if user is None or not user.is_active:
            return None

        return user
    except Exception:
        return None


async def get_current_cart(
    db: Annotated[AsyncSession, Depends(get_db)],
    user: Annotated[User | None, Depends(get_optional_current_user)] = None,
    session_id: Annotated[str | None, Cookie(alias="cart_session_id")] = None,
    x_session_id: Annotated[str | None, Header(alias="X-Session-ID")] = None,
) -> Cart:
    """
    Get or create the current cart.

    For authenticated users, uses user_id.
    For guests, uses session_id from cookie or X-Session-ID header.
    """
    # Use header if cookie not present
    effective_session_id = session_id or x_session_id

    if user:
        return await get_or_create_cart(db, user_id=user.id)
    elif effective_session_id:
        return await get_or_create_cart(db, session_id=effective_session_id)
    else:
        raise ValueError("No user or session ID provided")


# Type alias for dependency injection
CurrentCart = Annotated[Cart, Depends(get_current_cart)]
