import { useState } from "react";
import {
    useAdminReviews,
    useUpdateReviewApproval,
    useUpdateReviewFeatured,
    useAddReviewResponse,
    useDeleteReviewResponse,
} from "../api/reviews";
import type { ReviewFilters, ReviewListItem } from "../types/reviews-customers";
import "./admin-reviews.css";

export function AdminReviews() {
    const [filters, setFilters] = useState<ReviewFilters>({
        page: 1,
        page_size: 20,
    });
    const [respondingTo, setRespondingTo] = useState<ReviewListItem | null>(null);
    const [responseText, setResponseText] = useState("");

    const { data, isLoading, error } = useAdminReviews(filters);
    const updateApproval = useUpdateReviewApproval();
    const updateFeatured = useUpdateReviewFeatured();
    const addResponse = useAddReviewResponse();
    const deleteResponse = useDeleteReviewResponse();

    const handleFilterChange = (key: keyof ReviewFilters, value: unknown) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleApprovalToggle = async (review: ReviewListItem) => {
        await updateApproval.mutateAsync({
            reviewId: review.id,
            is_approved: !review.is_approved,
        });
    };

    const handleFeaturedToggle = async (review: ReviewListItem) => {
        await updateFeatured.mutateAsync({
            reviewId: review.id,
            is_featured: !review.is_featured,
        });
    };

    const handleSubmitResponse = async () => {
        if (!respondingTo || !responseText.trim()) return;
        await addResponse.mutateAsync({
            reviewId: respondingTo.id,
            response: responseText,
        });
        setRespondingTo(null);
        setResponseText("");
    };

    const handleDeleteResponse = async (review: ReviewListItem) => {
        if (!confirm("Remove this business response?")) return;
        await deleteResponse.mutateAsync(review.id);
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading reviews...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load reviews</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-reviews">
            <header className="admin-page-header">
                <h1>Review Management</h1>
                <p className="admin-page-subtitle">
                    Moderate customer reviews and respond to feedback
                </p>
            </header>

            {/* Filters */}
            <div className="reviews-filters">
                <select
                    value={filters.is_approved === null || filters.is_approved === undefined ? "" : String(filters.is_approved)}
                    onChange={(e) => handleFilterChange("is_approved", e.target.value === "" ? null : e.target.value === "true")}
                    className="filter-select"
                >
                    <option value="">All Statuses</option>
                    <option value="true">Approved</option>
                    <option value="false">Pending Approval</option>
                </select>

                <select
                    value={filters.is_featured === null || filters.is_featured === undefined ? "" : String(filters.is_featured)}
                    onChange={(e) => handleFilterChange("is_featured", e.target.value === "" ? null : e.target.value === "true")}
                    className="filter-select"
                >
                    <option value="">All Reviews</option>
                    <option value="true">Featured</option>
                    <option value="false">Not Featured</option>
                </select>

                <select
                    value={filters.has_response === null || filters.has_response === undefined ? "" : String(filters.has_response)}
                    onChange={(e) => handleFilterChange("has_response", e.target.value === "" ? null : e.target.value === "true")}
                    className="filter-select"
                >
                    <option value="">Any Response</option>
                    <option value="true">Has Response</option>
                    <option value="false">No Response</option>
                </select>

                <select
                    value={filters.min_rating || ""}
                    onChange={(e) => handleFilterChange("min_rating", e.target.value ? parseInt(e.target.value) : null)}
                    className="filter-select"
                >
                    <option value="">All Ratings</option>
                    <option value="5">5 Stars</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="1">1-2 Stars</option>
                </select>
            </div>

            {/* Summary */}
            <div className="reviews-summary">
                Showing {data?.items.length || 0} of {data?.total || 0} reviews
            </div>

            {/* Reviews List */}
            <div className="reviews-list">
                {data?.items.length === 0 ? (
                    <div className="empty-state">No reviews found</div>
                ) : (
                    data?.items.map((review) => (
                        <div key={review.id} className={`review-card ${!review.is_approved ? "pending" : ""}`}>
                            <div className="review-header">
                                <div className="review-rating">
                                    {"★".repeat(review.rating)}
                                    {"☆".repeat(5 - review.rating)}
                                </div>
                                <div className="review-badges">
                                    {review.is_verified_purchase && <span className="badge verified">✓ Verified</span>}
                                    {review.is_featured && <span className="badge featured">⭐ Featured</span>}
                                    {!review.is_approved && <span className="badge pending">Pending</span>}
                                </div>
                            </div>

                            <div className="review-content">
                                {review.title && <h3 className="review-title">{review.title}</h3>}
                                <p className="review-text">{review.content || <em>No content</em>}</p>
                            </div>

                            <div className="review-meta">
                                <span className="review-product">📦 {review.product_name}</span>
                                <span className="review-author">👤 {review.user_email}</span>
                                <span className="review-date">{new Date(review.created_at).toLocaleDateString()}</span>
                                <span className="review-helpful">👍 {review.helpful_count}</span>
                            </div>

                            {review.response && (
                                <div className="business-response">
                                    <strong>Your Response:</strong> {review.response}
                                    <button onClick={() => handleDeleteResponse(review)} className="remove-response-btn">
                                        ✕
                                    </button>
                                </div>
                            )}

                            <div className="review-actions">
                                <button
                                    onClick={() => handleApprovalToggle(review)}
                                    className={`action-btn ${review.is_approved ? "unapprove" : "approve"}`}
                                    disabled={updateApproval.isPending}
                                >
                                    {review.is_approved ? "Unapprove" : "Approve"}
                                </button>
                                <button
                                    onClick={() => handleFeaturedToggle(review)}
                                    className={`action-btn ${review.is_featured ? "unfeature" : "feature"}`}
                                    disabled={updateFeatured.isPending}
                                >
                                    {review.is_featured ? "Unfeature" : "Feature"}
                                </button>
                                {!review.response && (
                                    <button
                                        onClick={() => {
                                            setRespondingTo(review);
                                            setResponseText("");
                                        }}
                                        className="action-btn respond"
                                    >
                                        Respond
                                    </button>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Pagination */}
            {data && data.total_pages > 1 && (
                <div className="pagination">
                    <button
                        onClick={() => handlePageChange(data.page - 1)}
                        disabled={data.page <= 1}
                        className="page-btn"
                    >
                        ← Previous
                    </button>
                    <span className="page-info">
                        Page {data.page} of {data.total_pages}
                    </span>
                    <button
                        onClick={() => handlePageChange(data.page + 1)}
                        disabled={data.page >= data.total_pages}
                        className="page-btn"
                    >
                        Next →
                    </button>
                </div>
            )}

            {/* Response Modal */}
            {respondingTo && (
                <div className="modal-overlay" onClick={() => setRespondingTo(null)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <h3>Respond to Review</h3>
                        <p className="modal-review">
                            <strong>{respondingTo.user_email}:</strong> {respondingTo.content}
                        </p>
                        <textarea
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                            placeholder="Write your response..."
                            rows={4}
                            className="response-textarea"
                        />
                        <div className="modal-actions">
                            <button onClick={() => setRespondingTo(null)} className="cancel-btn">
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitResponse}
                                className="submit-btn"
                                disabled={!responseText.trim() || addResponse.isPending}
                            >
                                {addResponse.isPending ? "Sending..." : "Send Response"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
