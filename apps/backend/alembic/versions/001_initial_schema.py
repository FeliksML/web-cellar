"""Initial schema - users, categories, products, product_images

Revision ID: 001_initial
Revises:
Create Date: 2024-12-31
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '001_initial'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(length=255), nullable=False),
        sa.Column('hashed_password', sa.String(length=255), nullable=False),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('role', sa.String(length=20), nullable=False, server_default='customer'),
        sa.Column('first_name', sa.String(length=100), nullable=True),
        sa.Column('last_name', sa.String(length=100), nullable=True),
        sa.Column('phone', sa.String(length=20), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
    )
    op.create_index('ix_users_id', 'users', ['id'])
    op.create_index('ix_users_email', 'users', ['email'], unique=True)

    # Categories table
    op.create_table(
        'categories',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('slug', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('image_url', sa.String(length=500), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('name'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index('ix_categories_id', 'categories', ['id'])
    op.create_index('ix_categories_slug', 'categories', ['slug'])

    # Products table
    op.create_table(
        'products',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('sku', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=200), nullable=False),
        sa.Column('slug', sa.String(length=200), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('short_description', sa.String(length=500), nullable=True),
        # Pricing
        sa.Column('price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('compare_at_price', sa.Numeric(precision=10, scale=2), nullable=True),
        # Inventory
        sa.Column('stock_quantity', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('low_stock_threshold', sa.Integer(), nullable=False, server_default='5'),
        sa.Column('track_inventory', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('allow_backorder', sa.Boolean(), nullable=False, server_default='false'),
        # Display
        sa.Column('gradient_from', sa.String(length=7), nullable=True),
        sa.Column('gradient_to', sa.String(length=7), nullable=True),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_bestseller', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        # Nutrition
        sa.Column('protein_grams', sa.Integer(), nullable=True),
        sa.Column('calories', sa.Integer(), nullable=True),
        # Dietary flags
        sa.Column('is_gluten_free', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_dairy_free', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_vegan', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_keto_friendly', sa.Boolean(), nullable=False, server_default='false'),
        # Status
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        # SEO
        sa.Column('meta_title', sa.String(length=70), nullable=True),
        sa.Column('meta_description', sa.String(length=160), nullable=True),
        # Relationships
        sa.Column('category_id', sa.Integer(), nullable=True),
        # Timestamps
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['category_id'], ['categories.id']),
        sa.UniqueConstraint('sku'),
        sa.UniqueConstraint('slug'),
    )
    op.create_index('ix_products_id', 'products', ['id'])
    op.create_index('ix_products_sku', 'products', ['sku'])
    op.create_index('ix_products_slug', 'products', ['slug'])
    op.create_index('ix_products_is_featured', 'products', ['is_featured'])
    op.create_index('ix_products_is_bestseller', 'products', ['is_bestseller'])
    op.create_index('ix_products_is_active', 'products', ['is_active'])

    # Product images table
    op.create_table(
        'product_images',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('url', sa.String(length=500), nullable=False),
        sa.Column('alt_text', sa.String(length=255), nullable=True),
        sa.Column('display_order', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('is_primary', sa.Boolean(), nullable=False, server_default='false'),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
    )
    op.create_index('ix_product_images_id', 'product_images', ['id'])


def downgrade() -> None:
    op.drop_table('product_images')
    op.drop_table('products')
    op.drop_table('categories')
    op.drop_table('users')
