import { useState } from "react";
import { useLowStockProducts, useBulkUpdateStock } from "../api/dashboard";
import { useUpdateStock } from "../api/products";
import "./admin-inventory.css";

export function AdminInventory() {
    const { data: lowStockProducts, isLoading, error, refetch } = useLowStockProducts(50);
    const updateStock = useUpdateStock();
    const bulkUpdate = useBulkUpdateStock();

    const [editingId, setEditingId] = useState<number | null>(null);
    const [editValue, setEditValue] = useState<string>("");
    const [bulkUpdates, setBulkUpdates] = useState<Record<number, number>>({});

    const handleStartEdit = (productId: number, currentQty: number) => {
        setEditingId(productId);
        setEditValue(String(currentQty));
    };

    const handleSaveEdit = async (productId: number) => {
        const newQty = parseInt(editValue, 10);
        if (isNaN(newQty) || newQty < 0) return;

        await updateStock.mutateAsync({ productId, quantity: newQty });
        setEditingId(null);
        refetch();
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditValue("");
    };

    const handleBulkChange = (productId: number, value: string) => {
        const qty = parseInt(value, 10);
        if (!isNaN(qty) && qty >= 0) {
            setBulkUpdates((prev) => ({ ...prev, [productId]: qty }));
        } else if (value === "") {
            setBulkUpdates((prev) => {
                const newUpdates = { ...prev };
                delete newUpdates[productId];
                return newUpdates;
            });
        }
    };

    const handleBulkSave = async () => {
        const updates = Object.entries(bulkUpdates).map(([id, qty]) => ({
            product_id: parseInt(id, 10),
            new_quantity: qty,
        }));

        if (updates.length === 0) return;

        await bulkUpdate.mutateAsync({ updates });
        setBulkUpdates({});
        refetch();
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading inventory...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load inventory</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    const hasBulkChanges = Object.keys(bulkUpdates).length > 0;

    return (
        <div className="admin-inventory">
            <header className="admin-page-header">
                <div className="header-content">
                    <div>
                        <h1>Inventory Management</h1>
                        <p className="admin-page-subtitle">
                            Track stock levels and update quantities
                        </p>
                    </div>
                    {hasBulkChanges && (
                        <div className="bulk-actions">
                            <span className="bulk-count">{Object.keys(bulkUpdates).length} changes pending</span>
                            <button
                                onClick={() => setBulkUpdates({})}
                                className="bulk-cancel-btn"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBulkSave}
                                className="bulk-save-btn"
                                disabled={bulkUpdate.isPending}
                            >
                                {bulkUpdate.isPending ? "Saving..." : "Save All Changes"}
                            </button>
                        </div>
                    )}
                </div>
            </header>

            {/* Stock Summary */}
            <div className="stock-summary">
                <div className="summary-card out-of-stock">
                    <span className="summary-count">
                        {lowStockProducts?.filter((p) => p.stock_quantity === 0).length || 0}
                    </span>
                    <span className="summary-label">Out of Stock</span>
                </div>
                <div className="summary-card low-stock">
                    <span className="summary-count">
                        {lowStockProducts?.filter((p) => p.stock_quantity > 0).length || 0}
                    </span>
                    <span className="summary-label">Low Stock</span>
                </div>
                <div className="summary-card total">
                    <span className="summary-count">{lowStockProducts?.length || 0}</span>
                    <span className="summary-label">Need Attention</span>
                </div>
            </div>

            {/* Inventory Table */}
            <div className="inventory-table-wrapper">
                <table className="inventory-table">
                    <thead>
                        <tr>
                            <th>Product</th>
                            <th>SKU</th>
                            <th>Current Stock</th>
                            <th>Threshold</th>
                            <th>Status</th>
                            <th>Update Stock</th>
                        </tr>
                    </thead>
                    <tbody>
                        {lowStockProducts?.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="empty-row success">
                                    🎉 All products are well stocked!
                                </td>
                            </tr>
                        ) : (
                            lowStockProducts?.map((product) => (
                                <tr
                                    key={product.id}
                                    className={product.stock_quantity === 0 ? "critical" : "warning"}
                                >
                                    <td className="product-cell">
                                        {product.image_url && (
                                            <img
                                                src={product.image_url}
                                                alt={product.name}
                                                className="product-thumb"
                                            />
                                        )}
                                        <span className="product-name">{product.name}</span>
                                    </td>
                                    <td className="sku">{product.sku}</td>
                                    <td className={`stock-qty ${product.stock_quantity === 0 ? "critical" : "warning"}`}>
                                        {product.stock_quantity}
                                    </td>
                                    <td className="threshold">{product.low_stock_threshold}</td>
                                    <td>
                                        <span className={`status-badge ${product.stock_quantity === 0 ? "out" : "low"}`}>
                                            {product.stock_quantity === 0 ? "OUT OF STOCK" : "LOW STOCK"}
                                        </span>
                                    </td>
                                    <td className="update-cell">
                                        {editingId === product.id ? (
                                            <div className="edit-inline">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={editValue}
                                                    onChange={(e) => setEditValue(e.target.value)}
                                                    className="stock-input"
                                                    autoFocus
                                                />
                                                <button
                                                    onClick={() => handleSaveEdit(product.id)}
                                                    className="save-btn"
                                                    disabled={updateStock.isPending}
                                                >
                                                    ✓
                                                </button>
                                                <button onClick={handleCancelEdit} className="cancel-btn">
                                                    ✕
                                                </button>
                                            </div>
                                        ) : (
                                            <div className="update-controls">
                                                <input
                                                    type="number"
                                                    min="0"
                                                    placeholder="New qty"
                                                    value={bulkUpdates[product.id] ?? ""}
                                                    onChange={(e) => handleBulkChange(product.id, e.target.value)}
                                                    className="bulk-input"
                                                />
                                                <button
                                                    onClick={() => handleStartEdit(product.id, product.stock_quantity)}
                                                    className="quick-edit-btn"
                                                >
                                                    Edit
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
