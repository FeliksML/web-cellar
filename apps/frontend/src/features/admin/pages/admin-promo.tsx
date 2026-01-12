import { useState } from "react";
import {
    useAdminPromoCodes,
    useCreatePromoCode,
    useUpdatePromoCode,
    useDeletePromoCode,
} from "../api/promo";
import type { PromoCode, PromoCodeCreate } from "../types/analytics";
import "./admin-promo.css";

const emptyForm: PromoCodeCreate = {
    code: "",
    description: "",
    discount_type: "percentage",
    discount_value: 10,
    minimum_order_value: null,
    maximum_discount: null,
    usage_limit: null,
    valid_from: null,
    valid_until: null,
    is_active: true,
};

export function AdminPromo() {
    const [filters, setFilters] = useState({ page: 1, page_size: 20 });
    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [form, setForm] = useState<PromoCodeCreate>(emptyForm);

    const { data, isLoading, error } = useAdminPromoCodes(filters);
    const createPromo = useCreatePromoCode();
    const updatePromo = useUpdatePromoCode();
    const deletePromo = useDeletePromoCode();

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleCreate = () => {
        setEditingId(null);
        setForm(emptyForm);
        setShowModal(true);
    };

    const handleEdit = (promo: PromoCode) => {
        setEditingId(promo.id);
        setForm({
            code: promo.code,
            description: promo.description,
            discount_type: promo.discount_type as "percentage" | "fixed_amount",
            discount_value: promo.discount_value,
            minimum_order_value: promo.minimum_order_value,
            maximum_discount: promo.maximum_discount,
            usage_limit: promo.usage_limit,
            valid_from: promo.valid_from,
            valid_until: promo.valid_until,
            is_active: promo.is_active,
        });
        setShowModal(true);
    };

    const handleDelete = async (promo: PromoCode) => {
        if (!confirm(`Delete promo code "${promo.code}"?`)) return;
        await deletePromo.mutateAsync(promo.id);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            await updatePromo.mutateAsync({ id: editingId, data: form });
        } else {
            await createPromo.mutateAsync(form);
        }
        setShowModal(false);
    };

    const handleToggleActive = async (promo: PromoCode) => {
        await updatePromo.mutateAsync({
            id: promo.id,
            data: { is_active: !promo.is_active },
        });
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading promo codes...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load promo codes</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-promo">
            <header className="admin-page-header">
                <div className="header-content">
                    <div>
                        <h1>🎟️ Promo Codes</h1>
                        <p className="admin-page-subtitle">
                            Create and manage discount codes
                        </p>
                    </div>
                    <button onClick={handleCreate} className="create-btn">
                        + Create Promo Code
                    </button>
                </div>
            </header>

            {/* Promo Codes Table */}
            <div className="promo-table-wrapper">
                <table className="promo-table">
                    <thead>
                        <tr>
                            <th>Code</th>
                            <th>Discount</th>
                            <th>Conditions</th>
                            <th>Usage</th>
                            <th>Validity</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data?.items.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="empty-row">
                                    No promo codes yet. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            data?.items.map((promo) => (
                                <tr key={promo.id} className={!promo.is_active ? "inactive" : ""}>
                                    <td className="code-cell">
                                        <span className="code">{promo.code}</span>
                                        {promo.description && (
                                            <span className="description">{promo.description}</span>
                                        )}
                                    </td>
                                    <td className="discount-cell">
                                        {promo.discount_type === "percentage"
                                            ? `${promo.discount_value}%`
                                            : `$${promo.discount_value}`}
                                    </td>
                                    <td className="conditions-cell">
                                        {promo.minimum_order_value && (
                                            <span>Min: ${promo.minimum_order_value}</span>
                                        )}
                                        {promo.maximum_discount && (
                                            <span>Max: ${promo.maximum_discount}</span>
                                        )}
                                        {!promo.minimum_order_value && !promo.maximum_discount && (
                                            <span className="none">No conditions</span>
                                        )}
                                    </td>
                                    <td className="usage-cell">
                                        {promo.usage_limit
                                            ? `${promo.usage_count}/${promo.usage_limit}`
                                            : `${promo.usage_count} (unlimited)`}
                                    </td>
                                    <td className="validity-cell">
                                        {promo.valid_from || promo.valid_until ? (
                                            <>
                                                {promo.valid_from && (
                                                    <span>From: {formatDate(promo.valid_from)}</span>
                                                )}
                                                {promo.valid_until && (
                                                    <span>Until: {formatDate(promo.valid_until)}</span>
                                                )}
                                            </>
                                        ) : (
                                            <span className="none">Always valid</span>
                                        )}
                                    </td>
                                    <td>
                                        <button
                                            onClick={() => handleToggleActive(promo)}
                                            className={`status-toggle ${promo.is_active ? "active" : "inactive"}`}
                                        >
                                            {promo.is_active ? "Active" : "Inactive"}
                                        </button>
                                    </td>
                                    <td className="actions-cell">
                                        <button onClick={() => handleEdit(promo)} className="edit-btn">
                                            Edit
                                        </button>
                                        <button onClick={() => handleDelete(promo)} className="delete-btn">
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
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

            {/* Create/Edit Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal promo-modal" onClick={(e) => e.stopPropagation()}>
                        <h3>{editingId ? "Edit Promo Code" : "Create Promo Code"}</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Code *</label>
                                    <input
                                        type="text"
                                        value={form.code}
                                        onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
                                        required
                                        placeholder="e.g. SUMMER20"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Discount Type *</label>
                                    <select
                                        value={form.discount_type}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                discount_type: e.target.value as "percentage" | "fixed_amount",
                                            })
                                        }
                                    >
                                        <option value="percentage">Percentage (%)</option>
                                        <option value="fixed_amount">Fixed Amount ($)</option>
                                    </select>
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Discount Value *</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step={form.discount_type === "percentage" ? "1" : "0.01"}
                                        value={form.discount_value}
                                        onChange={(e) => setForm({ ...form, discount_value: parseFloat(e.target.value) })}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Minimum Order ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.minimum_order_value || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                minimum_order_value: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Maximum Discount ($)</label>
                                    <input
                                        type="number"
                                        min="0"
                                        step="0.01"
                                        value={form.maximum_discount || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                maximum_discount: e.target.value ? parseFloat(e.target.value) : null,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Usage Limit</label>
                                    <input
                                        type="number"
                                        min="0"
                                        value={form.usage_limit || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                usage_limit: e.target.value ? parseInt(e.target.value) : null,
                                            })
                                        }
                                        placeholder="Unlimited"
                                    />
                                </div>
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <input
                                    type="text"
                                    value={form.description || ""}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    placeholder="Optional description"
                                />
                            </div>

                            <div className="form-row">
                                <div className="form-group">
                                    <label>Valid From</label>
                                    <input
                                        type="datetime-local"
                                        value={form.valid_from?.slice(0, 16) || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                valid_from: e.target.value ? new Date(e.target.value).toISOString() : null,
                                            })
                                        }
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Valid Until</label>
                                    <input
                                        type="datetime-local"
                                        value={form.valid_until?.slice(0, 16) || ""}
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                valid_until: e.target.value ? new Date(e.target.value).toISOString() : null,
                                            })
                                        }
                                    />
                                </div>
                            </div>

                            <div className="modal-actions">
                                <button type="button" onClick={() => setShowModal(false)} className="cancel-btn">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="submit-btn"
                                    disabled={createPromo.isPending || updatePromo.isPending}
                                >
                                    {createPromo.isPending || updatePromo.isPending
                                        ? "Saving..."
                                        : editingId
                                            ? "Update"
                                            : "Create"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    });
}
