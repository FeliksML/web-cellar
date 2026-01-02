"""Review Pydantic schemas."""

from datetime import datetime

from pydantic import BaseModel, Field


class ReviewBase(BaseModel):
    """Base review schema."""

    rating: int = Field(..., ge=1, le=5)
    title: str | None = Field(None, max_length=200)
    content: str | None = None


class ReviewCreate(ReviewBase):
    """Schema for creating a review."""

    pass


class ReviewUpdate(BaseModel):
    """Schema for updating a review."""

    rating: int | None = Field(None, ge=1, le=5)
    title: str | None = Field(None, max_length=200)
    content: str | None = None


class ReviewUserResponse(BaseModel):
    """Simplified user info for review display."""

    id: int
    first_name: str | None
    last_name: str | None

    class Config:
        from_attributes = True


class ReviewResponse(BaseModel):
    """Schema for review response."""

    id: int
    product_id: int
    user_id: int
    rating: int
    title: str | None
    content: str | None
    is_verified_purchase: bool
    is_featured: bool
    helpful_count: int
    response: str | None
    response_at: datetime | None
    created_at: datetime
    updated_at: datetime
    user: ReviewUserResponse

    class Config:
        from_attributes = True


class PaginatedReviews(BaseModel):
    """Paginated reviews response."""

    items: list[ReviewResponse]
    total: int
    page: int
    page_size: int
    total_pages: int
    average_rating: float | None


class ReviewSummary(BaseModel):
    """Review summary stats for a product."""

    average_rating: float | None
    total_reviews: int
    rating_distribution: dict[int, int]  # {5: 10, 4: 5, ...}


class ReviewResponseCreate(BaseModel):
    """Schema for business response to review (admin)."""

    response: str
