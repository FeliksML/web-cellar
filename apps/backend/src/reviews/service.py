"""Review service layer for business logic."""

from datetime import datetime
from decimal import Decimal

from sqlalchemy import func, select, update
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.orders.models import Order, OrderItem
from src.products.models import Product
from src.reviews.models import Review, ReviewHelpful
from src.reviews.schemas import ReviewCreate, ReviewUpdate


async def get_reviews_by_product(
    db: AsyncSession,
    product_id: int,
    page: int = 1,
    page_size: int = 10,
    only_approved: bool = True,
) -> tuple[list[Review], int, float | None]:
    """Get paginated reviews for a product."""
    query = (
        select(Review)
        .where(Review.product_id == product_id)
        .options(selectinload(Review.user))
    )

    if only_approved:
        query = query.where(Review.is_approved.is_(True))

    # Count total
    count_query = select(func.count(Review.id)).where(Review.product_id == product_id)
    if only_approved:
        count_query = count_query.where(Review.is_approved.is_(True))
    total = (await db.execute(count_query)).scalar() or 0

    # Calculate average rating
    avg_query = select(func.avg(Review.rating)).where(Review.product_id == product_id)
    if only_approved:
        avg_query = avg_query.where(Review.is_approved.is_(True))
    avg_result = (await db.execute(avg_query)).scalar()
    average_rating = float(avg_result) if avg_result else None

    # Get reviews with pagination
    query = (
        query.order_by(Review.is_featured.desc(), Review.helpful_count.desc(), Review.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    reviews = list(result.scalars().all())

    return reviews, total, average_rating


async def get_review_by_id(
    db: AsyncSession,
    review_id: int,
) -> Review | None:
    """Get a review by ID."""
    query = select(Review).where(Review.id == review_id).options(selectinload(Review.user))
    result = await db.execute(query)
    return result.scalars().first()


async def get_user_review_for_product(
    db: AsyncSession,
    user_id: int,
    product_id: int,
) -> Review | None:
    """Get a user's review for a specific product."""
    query = (
        select(Review)
        .where(Review.user_id == user_id)
        .where(Review.product_id == product_id)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def check_user_purchased_product(
    db: AsyncSession,
    user_id: int,
    product_id: int,
) -> OrderItem | None:
    """Check if user has purchased this product (for verified purchase badge)."""
    query = (
        select(OrderItem)
        .join(Order)
        .where(Order.user_id == user_id)
        .where(OrderItem.product_id == product_id)
        .where(Order.status.in_(["delivered", "picked_up"]))
        .order_by(Order.completed_at.desc())
        .limit(1)
    )
    result = await db.execute(query)
    return result.scalars().first()


async def create_review(
    db: AsyncSession,
    user_id: int,
    product_id: int,
    review_data: ReviewCreate,
) -> Review:
    """Create a new review."""
    # Check if user already reviewed this product
    existing = await get_user_review_for_product(db, user_id, product_id)
    if existing:
        raise ValueError("You have already reviewed this product")

    # Check for verified purchase
    order_item = await check_user_purchased_product(db, user_id, product_id)
    is_verified = order_item is not None

    review = Review(
        product_id=product_id,
        user_id=user_id,
        order_item_id=order_item.id if order_item else None,
        is_verified_purchase=is_verified,
        **review_data.model_dump(),
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)

    # Update product rating cache
    await _update_product_rating_cache(db, product_id)

    return review


async def update_review(
    db: AsyncSession,
    review: Review,
    review_data: ReviewUpdate,
) -> Review:
    """Update a review."""
    update_dict = review_data.model_dump(exclude_unset=True)
    for field, value in update_dict.items():
        setattr(review, field, value)

    review.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(review)

    # Update product rating cache if rating changed
    if "rating" in update_dict:
        await _update_product_rating_cache(db, review.product_id)

    return review


async def delete_review(db: AsyncSession, review: Review) -> None:
    """Delete a review."""
    product_id = review.product_id
    await db.delete(review)
    await db.commit()

    # Update product rating cache
    await _update_product_rating_cache(db, product_id)


async def mark_review_helpful(
    db: AsyncSession,
    review_id: int,
    user_id: int,
) -> bool:
    """Mark a review as helpful. Returns True if added, False if already marked."""
    # Check if already marked
    query = (
        select(ReviewHelpful)
        .where(ReviewHelpful.review_id == review_id)
        .where(ReviewHelpful.user_id == user_id)
    )
    result = await db.execute(query)
    existing = result.scalars().first()

    if existing:
        return False

    # Add helpful vote
    helpful = ReviewHelpful(review_id=review_id, user_id=user_id)
    db.add(helpful)

    # Update count on review
    await db.execute(
        update(Review)
        .where(Review.id == review_id)
        .values(helpful_count=Review.helpful_count + 1)
    )

    await db.commit()
    return True


async def add_business_response(
    db: AsyncSession,
    review: Review,
    response: str,
) -> Review:
    """Add a business response to a review (admin)."""
    review.response = response
    review.response_at = datetime.utcnow()
    await db.commit()
    await db.refresh(review)
    return review


async def _update_product_rating_cache(db: AsyncSession, product_id: int) -> None:
    """Update the cached average rating and review count on a product."""
    # Calculate new stats
    stats_query = select(
        func.avg(Review.rating),
        func.count(Review.id),
    ).where(Review.product_id == product_id).where(Review.is_approved.is_(True))

    result = await db.execute(stats_query)
    row = result.first()
    avg_rating = Decimal(str(round(row[0], 1))) if row[0] else None
    review_count = row[1] or 0

    # Update product
    await db.execute(
        update(Product)
        .where(Product.id == product_id)
        .values(average_rating=avg_rating, review_count=review_count)
    )
    await db.commit()


async def get_review_summary(
    db: AsyncSession,
    product_id: int,
) -> dict:
    """Get review summary statistics for a product."""
    # Get average and total
    stats_query = select(
        func.avg(Review.rating),
        func.count(Review.id),
    ).where(Review.product_id == product_id).where(Review.is_approved.is_(True))
    result = await db.execute(stats_query)
    row = result.first()
    average_rating = float(row[0]) if row[0] else None
    total_reviews = row[1] or 0

    # Get distribution
    dist_query = (
        select(Review.rating, func.count(Review.id))
        .where(Review.product_id == product_id)
        .where(Review.is_approved.is_(True))
        .group_by(Review.rating)
    )
    dist_result = await db.execute(dist_query)
    distribution = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
    for rating, count in dist_result:
        distribution[rating] = count

    return {
        "average_rating": average_rating,
        "total_reviews": total_reviews,
        "rating_distribution": distribution,
    }
