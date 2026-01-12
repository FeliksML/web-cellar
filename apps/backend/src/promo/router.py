"""Admin API routes for promo code management."""

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentAdmin
from src.database import get_db
from src.promo.models import PromoCode
from src.promo.schemas import (
    PromoCodeCreate,
    PromoCodeUpdate,
    PromoCodeResponse,
    PaginatedPromoCodes,
)


router = APIRouter(prefix="/admin/promo-codes", tags=["admin-promo"])


@router.get(
    "",
    response_model=PaginatedPromoCodes,
    operation_id="adminListPromoCodes",
)
async def list_promo_codes(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    is_active: Annotated[bool | None, Query()] = None,
    search: Annotated[str | None, Query()] = None,
) -> PaginatedPromoCodes:
    """List all promo codes (admin only)."""
    query = select(PromoCode)

    if is_active is not None:
        query = query.where(PromoCode.is_active == is_active)
    if search:
        query = query.where(PromoCode.code.ilike(f"%{search}%"))

    # Count total
    count_query = select(func.count(PromoCode.id))
    if is_active is not None:
        count_query = count_query.where(PromoCode.is_active == is_active)
    if search:
        count_query = count_query.where(PromoCode.code.ilike(f"%{search}%"))
    total = (await db.execute(count_query)).scalar() or 0

    # Paginate
    query = (
        query.order_by(PromoCode.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    result = await db.execute(query)
    codes = list(result.scalars().all())

    items = [PromoCodeResponse.model_validate(code) for code in codes]
    total_pages = (total + page_size - 1) // page_size

    return PaginatedPromoCodes(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.post(
    "",
    response_model=PromoCodeResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="adminCreatePromoCode",
)
async def create_promo_code(
    data: PromoCodeCreate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PromoCodeResponse:
    """Create a new promo code (admin only)."""
    # Check for duplicate code
    existing = await db.execute(
        select(PromoCode).where(PromoCode.code == data.code.upper())
    )
    if existing.scalar():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Promo code already exists",
        )

    promo = PromoCode(
        code=data.code.upper(),
        description=data.description,
        discount_type=data.discount_type,
        discount_value=data.discount_value,
        minimum_order_value=data.minimum_order_value,
        maximum_discount=data.maximum_discount,
        usage_limit=data.usage_limit,
        valid_from=data.valid_from,
        valid_until=data.valid_until,
        is_active=data.is_active,
    )
    db.add(promo)
    await db.commit()
    await db.refresh(promo)

    return PromoCodeResponse.model_validate(promo)


@router.get(
    "/{promo_id}",
    response_model=PromoCodeResponse,
    operation_id="adminGetPromoCode",
)
async def get_promo_code(
    promo_id: int,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PromoCodeResponse:
    """Get a promo code by ID (admin only)."""
    promo = await db.get(PromoCode, promo_id)
    if not promo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promo code not found",
        )
    return PromoCodeResponse.model_validate(promo)


@router.put(
    "/{promo_id}",
    response_model=PromoCodeResponse,
    operation_id="adminUpdatePromoCode",
)
async def update_promo_code(
    promo_id: int,
    data: PromoCodeUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> PromoCodeResponse:
    """Update a promo code (admin only)."""
    promo = await db.get(PromoCode, promo_id)
    if not promo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promo code not found",
        )

    update_dict = data.model_dump(exclude_unset=True)
    
    # Check for duplicate code if changing
    if "code" in update_dict and update_dict["code"]:
        new_code = update_dict["code"].upper()
        existing = await db.execute(
            select(PromoCode)
            .where(PromoCode.code == new_code)
            .where(PromoCode.id != promo_id)
        )
        if existing.scalar():
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Promo code already exists",
            )
        update_dict["code"] = new_code

    for field, value in update_dict.items():
        setattr(promo, field, value)
    
    promo.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(promo)

    return PromoCodeResponse.model_validate(promo)


@router.delete(
    "/{promo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="adminDeletePromoCode",
)
async def delete_promo_code(
    promo_id: int,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Delete a promo code (admin only)."""
    promo = await db.get(PromoCode, promo_id)
    if not promo:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Promo code not found",
        )
    
    await db.delete(promo)
    await db.commit()
