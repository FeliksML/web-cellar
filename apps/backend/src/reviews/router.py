"""Review API routes."""

from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from src.auth.dependencies import CurrentUser
from src.database import get_db
from src.products.service import get_product_by_slug
from src.reviews.schemas import (
    PaginatedReviews,
    ReviewCreate,
    ReviewResponse,
    ReviewSummary,
    ReviewUpdate,
)
from src.reviews.service import (
    create_review,
    delete_review,
    get_review_by_id,
    get_review_summary,
    get_reviews_by_product,
    mark_review_helpful,
    update_review,
)

router = APIRouter(tags=["reviews"])


@router.get(
    "/products/{slug}/reviews",
    response_model=PaginatedReviews,
    operation_id="getProductReviews",
)
async def list_product_reviews(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db)],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=50)] = 10,
) -> PaginatedReviews:
    """Get reviews for a product."""
    product = await get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    reviews, total, average_rating = await get_reviews_by_product(
        db, product.id, page, page_size
    )

    total_pages = (total + page_size - 1) // page_size
    return PaginatedReviews(
        items=reviews,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=total_pages,
        average_rating=average_rating,
    )


@router.get(
    "/products/{slug}/reviews/summary",
    response_model=ReviewSummary,
    operation_id="getProductReviewSummary",
)
async def get_product_review_summary(
    slug: str,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewSummary:
    """Get review summary statistics for a product."""
    product = await get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    summary = await get_review_summary(db, product.id)
    return ReviewSummary(**summary)


@router.post(
    "/products/{slug}/reviews",
    response_model=ReviewResponse,
    status_code=status.HTTP_201_CREATED,
    operation_id="createReview",
)
async def create_product_review(
    slug: str,
    review_data: ReviewCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewResponse:
    """Create a review for a product."""
    product = await get_product_by_slug(db, slug)
    if not product:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Product not found",
        )

    try:
        review = await create_review(db, current_user.id, product.id, review_data)
        return review
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e),
        )


@router.put(
    "/reviews/{review_id}",
    response_model=ReviewResponse,
    operation_id="updateReview",
)
async def update_own_review(
    review_id: int,
    review_data: ReviewUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> ReviewResponse:
    """Update your own review."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only edit your own reviews",
        )

    updated = await update_review(db, review, review_data)
    return updated


@router.delete(
    "/reviews/{review_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    operation_id="deleteReview",
)
async def delete_own_review(
    review_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> None:
    """Delete your own review."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    if review.user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can only delete your own reviews",
        )

    await delete_review(db, review)


@router.post(
    "/reviews/{review_id}/helpful",
    status_code=status.HTTP_200_OK,
    operation_id="markReviewHelpful",
)
async def mark_helpful(
    review_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
) -> dict:
    """Mark a review as helpful."""
    review = await get_review_by_id(db, review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found",
        )

    added = await mark_review_helpful(db, review_id, current_user.id)
    return {"added": added, "message": "Marked as helpful" if added else "Already marked"}
