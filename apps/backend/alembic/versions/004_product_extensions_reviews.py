"""Add bakery fields to products and reviews tables

Revision ID: 004_product_extensions_reviews
Revises: 003_orders
Create Date: 2024-12-31
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '004_product_extensions_reviews'
down_revision: Union[str, None] = '003_orders'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add bakery-specific fields to products table
    op.add_column('products', sa.Column('lead_time_hours', sa.Integer(), nullable=False, server_default='0'))
    op.add_column('products', sa.Column('minimum_quantity', sa.Integer(), nullable=False, server_default='1'))
    op.add_column('products', sa.Column('quantity_increment', sa.Integer(), nullable=False, server_default='1'))
    op.add_column('products', sa.Column('allergens', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('is_seasonal', sa.Boolean(), nullable=False, server_default='false'))
    op.add_column('products', sa.Column('available_from', sa.Date(), nullable=True))
    op.add_column('products', sa.Column('available_until', sa.Date(), nullable=True))
    op.add_column('products', sa.Column('available_days', sa.JSON(), nullable=True))
    op.add_column('products', sa.Column('average_rating', sa.Numeric(precision=2, scale=1), nullable=True))
    op.add_column('products', sa.Column('review_count', sa.Integer(), nullable=False, server_default='0'))

    # Reviews table
    op.create_table(
        'reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('order_item_id', sa.Integer(), nullable=True),
        sa.Column('rating', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=True),
        sa.Column('content', sa.Text(), nullable=True),
        sa.Column('is_verified_purchase', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('is_approved', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('is_featured', sa.Boolean(), nullable=False, server_default='false'),
        sa.Column('helpful_count', sa.Integer(), nullable=False, server_default='0'),
        sa.Column('response', sa.Text(), nullable=True),
        sa.Column('response_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['order_item_id'], ['order_items.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('user_id', 'product_id', name='uq_review_user_product'),
    )
    op.create_index('ix_reviews_id', 'reviews', ['id'])
    op.create_index('ix_reviews_product_id', 'reviews', ['product_id'])
    op.create_index('ix_reviews_user_id', 'reviews', ['user_id'])
    op.create_index('ix_reviews_created_at', 'reviews', ['created_at'])

    # Review helpful votes table
    op.create_table(
        'review_helpful',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('review_id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['review_id'], ['reviews.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.UniqueConstraint('review_id', 'user_id', name='uq_helpful_review_user'),
    )
    op.create_index('ix_review_helpful_id', 'review_helpful', ['id'])
    op.create_index('ix_review_helpful_review_id', 'review_helpful', ['review_id'])
    op.create_index('ix_review_helpful_user_id', 'review_helpful', ['user_id'])


def downgrade() -> None:
    op.drop_table('review_helpful')
    op.drop_table('reviews')

    # Remove bakery-specific fields from products
    op.drop_column('products', 'review_count')
    op.drop_column('products', 'average_rating')
    op.drop_column('products', 'available_days')
    op.drop_column('products', 'available_until')
    op.drop_column('products', 'available_from')
    op.drop_column('products', 'is_seasonal')
    op.drop_column('products', 'allergens')
    op.drop_column('products', 'quantity_increment')
    op.drop_column('products', 'minimum_quantity')
    op.drop_column('products', 'lead_time_hours')
