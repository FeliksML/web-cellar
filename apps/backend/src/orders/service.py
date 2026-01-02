"""Order service layer for business logic."""

import secrets
import string
from datetime import datetime
from decimal import Decimal

from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from src.addresses.models import Address
from src.cart.models import Cart
from src.orders.models import Order, OrderItem
from src.orders.schemas import AddressSnapshot, OrderCreate, OrderFilters, OrderStatusUpdate
from src.products.models import Product


def generate_order_number() -> str:
    """Generate a unique order number."""
    timestamp = datetime.utcnow().strftime("%y%m%d")
    random_part = "".join(secrets.choice(string.ascii_uppercase + string.digits) for _ in range(4))
    return f"BB-{timestamp}-{random_part}"


async def get_order_by_id(
    db: AsyncSession,
    order_id: int,
    user_id: int | None = None,
) -> Order | None:
    """Get an order by ID, optionally filtering by user."""
    query = (
        select(Order)
        .where(Order.id == order_id)
        .options(selectinload(Order.items))
    )
    if user_id is not None:
        query = query.where(Order.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().first()


async def get_order_by_number(
    db: AsyncSession,
    order_number: str,
    user_id: int | None = None,
) -> Order | None:
    """Get an order by order number."""
    query = (
        select(Order)
        .where(Order.order_number == order_number)
        .options(selectinload(Order.items))
    )
    if user_id is not None:
        query = query.where(Order.user_id == user_id)
    result = await db.execute(query)
    return result.scalars().first()


async def get_orders_by_user(
    db: AsyncSession,
    user_id: int,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[Order], int]:
    """Get paginated orders for a user."""
    # Count total
    count_query = select(func.count(Order.id)).where(Order.user_id == user_id)
    total = (await db.execute(count_query)).scalar() or 0

    # Get orders
    query = (
        select(Order)
        .where(Order.user_id == user_id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    orders = list(result.scalars().all())

    return orders, total


async def get_all_orders(
    db: AsyncSession,
    filters: OrderFilters,
    page: int = 1,
    page_size: int = 20,
) -> tuple[list[Order], int]:
    """Get paginated orders with filters (admin)."""
    query = select(Order).options(selectinload(Order.items))

    # Apply filters
    if filters.status:
        query = query.where(Order.status == filters.status)
    if filters.payment_status:
        query = query.where(Order.payment_status == filters.payment_status)
    if filters.fulfillment_type:
        query = query.where(Order.fulfillment_type == filters.fulfillment_type)
    if filters.date_from:
        query = query.where(Order.requested_date >= filters.date_from)
    if filters.date_to:
        query = query.where(Order.requested_date <= filters.date_to)
    if filters.search:
        search_term = f"%{filters.search}%"
        query = query.where(
            (Order.order_number.ilike(search_term))
            | (Order.contact_email.ilike(search_term))
        )

    # Count total
    count_query = select(func.count()).select_from(query.subquery())
    total = (await db.execute(count_query)).scalar() or 0

    # Apply pagination and ordering
    query = (
        query.order_by(Order.created_at.desc())
        .offset((page - 1) * page_size)
        .limit(page_size)
    )
    result = await db.execute(query)
    orders = list(result.scalars().all())

    return orders, total


async def create_order_from_cart(
    db: AsyncSession,
    cart: Cart,
    order_data: OrderCreate,
    user_id: int | None = None,
) -> Order:
    """Create an order from a cart."""
    if cart.is_empty:
        raise ValueError("Cart is empty")

    # Get or build shipping address snapshot
    shipping_snapshot: dict
    if order_data.shipping_address_id:
        address = await db.get(Address, order_data.shipping_address_id)
        if not address:
            raise ValueError("Shipping address not found")
        shipping_snapshot = AddressSnapshot(
            first_name=address.first_name,
            last_name=address.last_name,
            phone=address.phone,
            address_line1=address.address_line1,
            address_line2=address.address_line2,
            city=address.city,
            state=address.state,
            postal_code=address.postal_code,
            country=address.country,
            delivery_instructions=address.delivery_instructions,
        ).model_dump()
    elif order_data.shipping_address:
        shipping_snapshot = order_data.shipping_address.model_dump()
    else:
        raise ValueError("Shipping address required")

    # Billing address (if different)
    billing_snapshot = None
    if not order_data.billing_same_as_shipping:
        if order_data.billing_address_id:
            billing = await db.get(Address, order_data.billing_address_id)
            if billing:
                billing_snapshot = AddressSnapshot(
                    first_name=billing.first_name,
                    last_name=billing.last_name,
                    phone=billing.phone,
                    address_line1=billing.address_line1,
                    address_line2=billing.address_line2,
                    city=billing.city,
                    state=billing.state,
                    postal_code=billing.postal_code,
                    country=billing.country,
                ).model_dump()

    # Calculate totals
    subtotal = cart.subtotal
    shipping_cost = Decimal("0.00")  # TODO: Calculate based on address
    tax_amount = Decimal("0.00")  # TODO: Calculate based on location
    discount_amount = Decimal("0.00")
    total = subtotal + shipping_cost + tax_amount - discount_amount

    # Create order
    order = Order(
        order_number=generate_order_number(),
        user_id=user_id,
        status="pending",
        shipping_address_id=order_data.shipping_address_id,
        billing_address_id=order_data.billing_address_id if not order_data.billing_same_as_shipping else None,
        shipping_address_snapshot=shipping_snapshot,
        billing_address_snapshot=billing_snapshot,
        subtotal=subtotal,
        shipping_cost=shipping_cost,
        tax_amount=tax_amount,
        discount_amount=discount_amount,
        total=total,
        payment_status="pending",
        payment_method=order_data.payment_method,
        stripe_payment_intent_id=order_data.stripe_payment_intent_id,
        fulfillment_type=order_data.fulfillment_type,
        requested_date=order_data.requested_date,
        requested_time_slot=order_data.requested_time_slot,
        contact_email=order_data.contact_email,
        contact_phone=order_data.contact_phone,
        customer_notes=order_data.customer_notes,
    )
    db.add(order)
    await db.flush()  # Get order ID

    # Create order items from cart items
    for cart_item in cart.items:
        product = await db.get(Product, cart_item.product_id)
        if not product:
            continue

        # Create product snapshot
        product_snapshot = {
            "id": product.id,
            "name": product.name,
            "sku": product.sku,
            "price": str(product.price),
            "description": product.short_description or product.description[:200] if product.description else None,
            "is_gluten_free": product.is_gluten_free,
            "is_dairy_free": product.is_dairy_free,
            "is_vegan": product.is_vegan,
        }

        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            product_name=product.name,
            product_sku=product.sku,
            product_snapshot=product_snapshot,
            quantity=cart_item.quantity,
            unit_price=cart_item.unit_price,
            subtotal=cart_item.line_total,
            special_instructions=cart_item.special_instructions,
        )
        db.add(order_item)

        # Reserve inventory
        if product.track_inventory:
            product.stock_quantity -= cart_item.quantity

    await db.commit()
    await db.refresh(order)
    return order


async def update_order_status(
    db: AsyncSession,
    order: Order,
    status_data: OrderStatusUpdate,
) -> Order:
    """Update an order's status."""
    now = datetime.utcnow()
    old_status = order.status
    new_status = status_data.status

    # Validate status transition
    valid_transitions = {
        "pending": ["confirmed", "cancelled"],
        "confirmed": ["preparing", "cancelled"],
        "preparing": ["ready"],
        "ready": ["out_for_delivery", "picked_up"],
        "out_for_delivery": ["delivered"],
        "delivered": [],
        "picked_up": [],
        "cancelled": [],
    }

    if new_status not in valid_transitions.get(old_status, []):
        raise ValueError(f"Cannot transition from {old_status} to {new_status}")

    order.status = new_status

    # Set appropriate timestamp
    if new_status == "confirmed":
        order.confirmed_at = now
    elif new_status == "preparing":
        order.preparing_at = now
    elif new_status == "ready":
        order.ready_at = now
    elif new_status in ("delivered", "picked_up"):
        order.completed_at = now
    elif new_status == "cancelled":
        order.cancelled_at = now
        order.cancellation_reason = status_data.reason

        # Release inventory
        for item in order.items:
            product = await db.get(Product, item.product_id)
            if product and product.track_inventory:
                product.stock_quantity += item.quantity

    order.updated_at = now
    await db.commit()
    await db.refresh(order)
    return order


async def cancel_order(
    db: AsyncSession,
    order: Order,
    reason: str | None = None,
) -> Order:
    """Cancel an order."""
    if not order.is_cancellable:
        raise ValueError("Order cannot be cancelled")

    status_data = OrderStatusUpdate(status="cancelled", reason=reason)
    return await update_order_status(db, order, status_data)


async def update_order_notes(
    db: AsyncSession,
    order: Order,
    internal_notes: str | None,
) -> Order:
    """Update order internal notes (admin)."""
    order.internal_notes = internal_notes
    order.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(order)
    return order


async def confirm_payment(
    db: AsyncSession,
    order: Order,
    payment_intent_id: str | None = None,
) -> Order:
    """Mark order as paid."""
    order.payment_status = "paid"
    if payment_intent_id:
        order.stripe_payment_intent_id = payment_intent_id
    order.updated_at = datetime.utcnow()
    await db.commit()
    await db.refresh(order)
    return order
