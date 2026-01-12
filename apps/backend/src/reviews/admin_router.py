"""Admin API routes for reviews management."""

from datetime import datetime
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from pydantic import BaseModel
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.auth.dependencies import CurrentAdmin
from src.database import get_db
from src.reviews.models import Review
from src.reviews.service import add_business_response, get_review_by_id


router = APIRouter(prefix="/admin/reviews", tags=["admin-reviews"])


class ReviewListResponse(BaseModel):
    """Review item for admin list."""
    id: int
    product_id: int
    product_name: str
    user_id: int
    user_email: str
    rating: int
    title: str | None
    content: str | None
    is_verified_purchase: bool
    is_approved: bool
    is_featured: bool
    helpful_count: int
    response: str | None
    response_at: datetime | None
    created_at: datetime

    class Config:
        from_attributes = True


class PaginatedReviews(BaseModel):
    """Paginated reviews response."""
    items: list[ReviewListResponse]
    total: int
    page: int
    page_size: int
    total_pages: int


class ReviewApprovalUpdate(BaseModel):
    """Update review approval status."""
    is_approved: bool


class ReviewFeaturedUpdate(BaseModel):
    """Update review featured status."""
    is_featured: bool


class ReviewResponseCreate(BaseModel):
    """Add business response to review."""
    response: str


@router.get(
    "",
    response_model=PaginatedReviews,
    operation_id="adminListReviews",
)
async def list_reviews(
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    is_approved: Annotated[bool | None, Query()] = None,
    is_featured: Annotated[bool | None, Query()] = None,
    has_response: Annotated[bool | None, Query()] = None,
    min_rating: Annotated[int | None, Query(ge=1, le=5)] = None,
    max_rating: Annotated[int | None, Query(ge=1, le=5)] = None,
) -> PaginatedReviews:
    """List all reviews with filters (admin only)."""
    from src.products.models import Product
    from src.auth.models import User

    query = (
        select(Review)
        .join(Product)
        .join(User)
        .options(selectinload(Review.product), selectinload(Review.user))
    )

    # Apply filters
    if is_approved is not None:
        query = query.where(Review.is_approved == is_approved)
    if is_featured is not None:
        query = query.where(Review.is_featured == is_featured)
    if has_response is True:
        query = query.where(Review.response.isnot(None))
    elif has_response is False:
        query = query.where(Review.response.is_(None))
    if min_rating is not None:
        query = query.where(Review.rating >= min_rating)
    if max_rating is not None:
        query = query.where(Review.rating <= max_rating)

    # Count total
    count_query = select(func.count(Review.id))
    if is_approved is not None:
        count_query = count_query.where(Review.is_approved == is_approved)
    if is_featured is not None:
        count_query = count_query.where(Review.is_featured == is_featured)
    if has_response is True:
        count_query = count_query.where(Review.response.isnot(None))
    elif has_response is False:
        count_query = count_query.where(Review.response.is_(None))
    if min_rating is not None:
        count_query = count_query.where(Review.rating >= min_rating)
    if max_rating is not None:
        count_query = count_query.where(Review.rating <= max_rating)

    total = (await db.execute(count_query)).scalar() or 0

    # Paginate
    query = (
        query.order_by(Review.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )

    result = await db.execute(query)
    reviews = list(result.scalars().all())

    items = []
    for review in reviews:
        items.append(ReviewListResponse(
            id=review.id,
            product_id=review.product_id,
            product_name=review.product.name,
            user_id=review.user_id,
            user_email=review.user.email,
            rating=review.rating,
            title=review.title,
            content=review.content,
            is_verified_purchase=review.is_verified_purchase,
            is_approved=review.is_approved,
            is_featured=review.is_featured,
            helpful_count=review.helpful_count,
            response=review.response,
            response_at=review.response_at,
            created_at=review.created_at,
        ))

    total_pages = (total + page_size - 1) // page_size
    return PaginatedReviews(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
    )


@router.put(
    "/{review_id}/approval",
    response_model=ReviewListResponse,
    operation_id="adminUpdateReviewApproval",
)
async def update_approval(
    review_id: int,
    data: ReviewApprovalUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewListResponse:
    """Update review approval status (admin only)."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    review.is_approved = data.is_approved
    await db.commit()
    await db.refresh(review)

    return ReviewListResponse(
        id=review.id,
        product_id=review.product_id,
        product_name=review.product.name,
        user_id=review.user_id,
        user_email=review.user.email,
        rating=review.rating,
        title=review.title,
        content=review.content,
        is_verified_purchase=review.is_verified_purchase,
        is_approved=review.is_approved,
        is_featured=review.is_featured,
        helpful_count=review.helpful_count,
        response=review.response,
        response_at=review.response_at,
        created_at=review.created_at,
    )


@router.put(
    "/{review_id}/featured",
    response_model=ReviewListResponse,
    operation_id="adminUpdateReviewFeatured",
)
async def update_featured(
    review_id: int,
    data: ReviewFeaturedUpdate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewListResponse:
    """Update review featured status (admin only)."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    review.is_featured = data.is_featured
    await db.commit()
    await db.refresh(review)

    return ReviewListResponse(
        id=review.id,
        product_id=review.product_id,
        product_name=review.product.name,
        user_id=review.user_id,
        user_email=review.user.email,
        rating=review.rating,
        title=review.title,
        content=review.content,
        is_verified_purchase=review.is_verified_purchase,
        is_approved=review.is_approved,
        is_featured=review.is_featured,
        helpful_count=review.helpful_count,
        response=review.response,
        response_at=review.response_at,
        created_at=review.created_at,
    )


@router.post(
    "/{review_id}/response",
    response_model=ReviewListResponse,
    operation_id="adminAddReviewResponse",
)
async def add_response(
    review_id: int,
    data: ReviewResponseCreate,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewListResponse:
    """Add business response to a review (admin only)."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    updated = await add_business_response(db, review, data.response)

    return ReviewListResponse(
        id=updated.id,
        product_id=updated.product_id,
        product_name=updated.product.name,
        user_id=updated.user_id,
        user_email=updated.user.email,
        rating=updated.rating,
        title=updated.title,
        content=updated.content,
        is_verified_purchase=updated.is_verified_purchase,
        is_approved=updated.is_approved,
        is_featured=updated.is_featured,
        helpful_count=updated.helpful_count,
        response=updated.response,
        response_at=updated.response_at,
        created_at=updated.created_at,
    )


@router.delete(
    "/{review_id}/response",
    response_model=ReviewListResponse,
    operation_id="adminDeleteReviewResponse",
)
async def delete_response(
    review_id: int,
    _admin: CurrentAdmin,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewListResponse:
    """Remove business response from a review (admin only)."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    review.response = None
    review.response_at = None
    await db.commit()
    await db.refresh(review)

    return ReviewListResponse(
        id=review.id,
        product_id=review.product_id,
        product_name=review.product.name,
        user_id=review.user_id,
        user_email=review.user.email,
        rating=review.rating,
        title=review.title,
        content=review.content,
        is_verified_purchase=review.is_verified_purchase,
        is_approved=review.is_approved,
        is_featured=review.is_featured,
        helpful_count=review.helpful_count,
        response=review.response,
        response_at=review.response_at,
        created_at=review.created_at,
    )
