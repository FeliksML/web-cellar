"""Add orders tables

Revision ID: 003_orders
Revises: 002_addresses_cart
Create Date: 2024-12-31
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '003_orders'
down_revision: Union[str, None] = '002_addresses_cart'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Orders table
    op.create_table(
        'orders',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_number', sa.String(length=20), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=True),
        # Status
        sa.Column('status', sa.String(length=30), nullable=False, server_default='pending'),
        # Addresses
        sa.Column('shipping_address_id', sa.Integer(), nullable=True),
        sa.Column('billing_address_id', sa.Integer(), nullable=True),
        sa.Column('shipping_address_snapshot', sa.JSON(), nullable=False),
        sa.Column('billing_address_snapshot', sa.JSON(), nullable=True),
        # Pricing
        sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('shipping_cost', sa.Numeric(precision=10, scale=2), nullable=False, server_default='0'),
        sa.Column('tax_amount', sa.Numeric(precision=10, scale=2), nullable=False, server_default='0'),
        sa.Column('discount_amount', sa.Numeric(precision=10, scale=2), nullable=False, server_default='0'),
        sa.Column('total', sa.Numeric(precision=10, scale=2), nullable=False),
        # Payment
        sa.Column('payment_status', sa.String(length=30), nullable=False, server_default='pending'),
        sa.Column('payment_method', sa.String(length=50), nullable=True),
        sa.Column('stripe_payment_intent_id', sa.String(length=100), nullable=True),
        # Fulfillment
        sa.Column('fulfillment_type', sa.String(length=20), nullable=False, server_default='delivery'),
        sa.Column('requested_date', sa.Date(), nullable=False),
        sa.Column('requested_time_slot', sa.String(length=50), nullable=True),
        # Contact
        sa.Column('contact_email', sa.String(length=255), nullable=False),
        sa.Column('contact_phone', sa.String(length=20), nullable=True),
        # Notes
        sa.Column('customer_notes', sa.Text(), nullable=True),
        sa.Column('internal_notes', sa.Text(), nullable=True),
        # Status timestamps
        sa.Column('confirmed_at', sa.DateTime(), nullable=True),
        sa.Column('preparing_at', sa.DateTime(), nullable=True),
        sa.Column('ready_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.Column('cancelled_at', sa.DateTime(), nullable=True),
        sa.Column('cancellation_reason', sa.Text(), nullable=True),
        # Timestamps
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['shipping_address_id'], ['addresses.id'], ondelete='SET NULL'),
        sa.ForeignKeyConstraint(['billing_address_id'], ['addresses.id'], ondelete='SET NULL'),
        sa.UniqueConstraint('order_number'),
    )
    op.create_index('ix_orders_id', 'orders', ['id'])
    op.create_index('ix_orders_order_number', 'orders', ['order_number'])
    op.create_index('ix_orders_user_id', 'orders', ['user_id'])
    op.create_index('ix_orders_status', 'orders', ['status'])
    op.create_index('ix_orders_requested_date', 'orders', ['requested_date'])
    op.create_index('ix_orders_created_at', 'orders', ['created_at'])
    op.create_index('ix_orders_stripe_payment_intent_id', 'orders', ['stripe_payment_intent_id'])
    op.create_index('ix_orders_user_status', 'orders', ['user_id', 'status'])
    op.create_index('ix_orders_requested_date_status', 'orders', ['requested_date', 'status'])

    # Order items table
    op.create_table(
        'order_items',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('order_id', sa.Integer(), nullable=False),
        sa.Column('product_id', sa.Integer(), nullable=False),
        sa.Column('product_name', sa.String(length=200), nullable=False),
        sa.Column('product_sku', sa.String(length=50), nullable=False),
        sa.Column('product_snapshot', sa.JSON(), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=False),
        sa.Column('unit_price', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('subtotal', sa.Numeric(precision=10, scale=2), nullable=False),
        sa.Column('special_instructions', sa.Text(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.PrimaryKeyConstraint('id'),
        sa.ForeignKeyConstraint(['order_id'], ['orders.id'], ondelete='CASCADE'),
        sa.ForeignKeyConstraint(['product_id'], ['products.id']),
    )
    op.create_index('ix_order_items_id', 'order_items', ['id'])
    op.create_index('ix_order_items_order_id', 'order_items', ['order_id'])
    op.create_index('ix_order_items_product_id', 'order_items', ['product_id'])


def downgrade() -> None:
    op.drop_table('order_items')
    op.drop_table('orders')
