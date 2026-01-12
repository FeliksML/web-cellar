import { useState } from "react";
import { useAdminProducts, useUpdateProduct, useDeleteProduct } from "../api/products";
import type { ProductFilters, ProductListItem } from "../types/products";
import "./admin-products.css";

export function AdminProducts() {
    const [filters, setFilters] = useState<ProductFilters>({
        page: 1,
        page_size: 20,
    });
    const [searchInput, setSearchInput] = useState("");

    const { data, isLoading, error } = useAdminProducts(filters);
    const updateProduct = useUpdateProduct();
    const deleteProduct = useDeleteProduct();

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        setFilters((prev) => ({ ...prev, search: searchInput || null, page: 1 }));
    };

    const handleFilterChange = (key: keyof ProductFilters, value: string | boolean | null) => {
        setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
    };

    const handlePageChange = (newPage: number) => {
        setFilters((prev) => ({ ...prev, page: newPage }));
    };

    const handleToggleActive = async (product: ProductListItem) => {
        await updateProduct.mutateAsync({
            productId: product.id,
            data: { is_active: !product.is_active },
        });
    };

    const handleToggleFeatured = async (product: ProductListItem) => {
        await updateProduct.mutateAsync({
            productId: product.id,
            data: { is_featured: !product.is_featured },
        });
    };

    const handleDelete = async (product: ProductListItem) => {
        if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
            await deleteProduct.mutateAsync(product.id);
        }
    };

    if (isLoading) {
        return (
            <div className="admin-loading">
                <div className="admin-loading-spinner" />
                <p>Loading products...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-error">
                <p>Failed to load products</p>
                <button onClick={() => window.location.reload()}>Retry</button>
            </div>
        );
    }

    return (
        <div className="admin-products">
            <header className="admin-page-header">
                <div className="header-content">
                    <div>
                        <h1>Products</h1>
                        <p className="admin-page-subtitle">
                            Manage your bakery products catalog
                        </p>
                    </div>
                    <button className="add-product-btn">+ Add Product</button>
                </div>
            </header>

            {/* Filters Bar */}
            <div className="products-filters">
                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchInput}
                        onChange={(e) => setSearchInput(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="search-btn">
                        Search
                    </button>
                </form>

                <div className="filter-group">
                    <select
                        value={filters.is_active === null || filters.is_active === undefined ? "" : String(filters.is_active)}
                        onChange={(e) => {
                            const val = e.target.value;
                            handleFilterChange("is_active", val === "" ? null : val === "true");
                        }}
                        className="filter-select"
                    >
                        <option value="">All Status</option>
                        <option value="true">Active</option>
                        <option value="false">Inactive</option>
                    </select>

                    {(filters.search || filters.is_active !== null && filters.is_active !== undefined) && (
                        <button
                            onClick={() => {
                                setFilters({ page: 1, page_size: 20 });
                                setSearchInput("");
                            }}
                            className="clear-filters-btn"
                        >
                            Clear Filters
                        </button>
                    )}
                </div>
            </div>

            {/* Results Summary */}
            <div className="products-summary">
                <span>
                    Showing {data?.items.length || 0} of {data?.total || 0} products
                </span>
            </div>

            {/* Products Grid */}
            <div className="products-grid">
                {data?.items.length === 0 ? (
                    <div className="empty-state">No products found</div>
                ) : (
                    data?.items.map((product) => (
                        <div key={product.id} className={`product-card ${!product.is_active ? "inactive" : ""}`}>
                            <div className="product-image">
                                {product.primary_image_url ? (
                                    <img src={product.primary_image_url} alt={product.name} />
                                ) : (
                                    <div className="no-image">🍪</div>
                                )}
                                {!product.is_active && <span className="inactive-badge">Inactive</span>}
                                {product.is_featured && <span className="featured-badge">⭐ Featured</span>}
                            </div>

                            <div className="product-info">
                                <h3 className="product-name">{product.name}</h3>
                                <p className="product-sku">{product.sku}</p>

                                <div className="product-meta">
                                    <div className="price-stock">
                                        <span className="price">
                                            ${product.price}
                                            {product.compare_at_price && (
                                                <span className="compare-price">${product.compare_at_price}</span>
                                            )}
                                        </span>
                                        <span className={`stock ${product.stock_quantity <= 5 ? "low" : ""}`}>
                                            {product.stock_quantity} in stock
                                        </span>
                                    </div>

                                    {product.category_name && (
                                        <span className="category">{product.category_name}</span>
                                    )}
                                </div>
                            </div>

                            <div className="product-actions">
                                <button
                                    onClick={() => handleToggleActive(product)}
                                    className={`action-btn ${product.is_active ? "deactivate" : "activate"}`}
                                    disabled={updateProduct.isPending}
                                >
                                    {product.is_active ? "Deactivate" : "Activate"}
                                </button>
                                <button
                                    onClick={() => handleToggleFeatured(product)}
                                    className={`action-btn feature ${product.is_featured ? "unfeatured" : ""}`}
                                    disabled={updateProduct.isPending}
                                >
                                    {product.is_featured ? "Unfeature" : "Feature"}
                                </button>
                                <button
                                    onClick={() => handleDelete(product)}
                                    className="action-btn delete"
                                    disabled={deleteProduct.isPending}
                                >
                                    Delete
                                </button>
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
        </div>
    );
}
