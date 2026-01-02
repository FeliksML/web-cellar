"""Stripe payment integration service."""

from decimal import Decimal
from typing import Any

import stripe

from src.config import get_settings


class StripeService:
    """Service for handling Stripe payment operations."""

    def __init__(self):
        settings = get_settings()
        stripe.api_key = settings.STRIPE_SECRET_KEY

    async def create_payment_intent(
        self,
        amount: Decimal,
        currency: str = "usd",
        metadata: dict[str, Any] | None = None,
    ) -> stripe.PaymentIntent:
        """
        Create a payment intent for checkout.

        Args:
            amount: Amount in dollars (will be converted to cents)
            currency: Currency code (default: usd)
            metadata: Additional metadata to attach to the payment

        Returns:
            Stripe PaymentIntent object
        """
        amount_cents = int(amount * 100)
        return stripe.PaymentIntent.create(
            amount=amount_cents,
            currency=currency,
            metadata=metadata or {},
            automatic_payment_methods={"enabled": True},
        )

    async def retrieve_payment_intent(
        self,
        payment_intent_id: str,
    ) -> stripe.PaymentIntent:
        """Retrieve a payment intent by ID."""
        return stripe.PaymentIntent.retrieve(payment_intent_id)

    async def confirm_payment_intent(
        self,
        payment_intent_id: str,
    ) -> stripe.PaymentIntent:
        """Confirm a payment intent."""
        return stripe.PaymentIntent.confirm(payment_intent_id)

    async def cancel_payment_intent(
        self,
        payment_intent_id: str,
    ) -> stripe.PaymentIntent:
        """Cancel a payment intent."""
        return stripe.PaymentIntent.cancel(payment_intent_id)

    async def create_refund(
        self,
        payment_intent_id: str,
        amount: Decimal | None = None,
        reason: str = "requested_by_customer",
    ) -> stripe.Refund:
        """
        Create a refund for a payment.

        Args:
            payment_intent_id: The payment intent to refund
            amount: Amount to refund in dollars (None for full refund)
            reason: Reason for refund

        Returns:
            Stripe Refund object
        """
        refund_params: dict[str, Any] = {
            "payment_intent": payment_intent_id,
            "reason": reason,
        }
        if amount is not None:
            refund_params["amount"] = int(amount * 100)

        return stripe.Refund.create(**refund_params)

    def construct_webhook_event(
        self,
        payload: bytes,
        sig_header: str,
        webhook_secret: str,
    ) -> stripe.Event:
        """
        Construct and verify a webhook event from Stripe.

        Args:
            payload: Raw request body
            sig_header: Stripe-Signature header value
            webhook_secret: Webhook signing secret

        Returns:
            Verified Stripe Event object

        Raises:
            stripe.error.SignatureVerificationError: If verification fails
        """
        return stripe.Webhook.construct_event(
            payload, sig_header, webhook_secret
        )


# Singleton instance
_stripe_service: StripeService | None = None


def get_stripe_service() -> StripeService:
    """Get or create the Stripe service singleton."""
    global _stripe_service
    if _stripe_service is None:
        _stripe_service = StripeService()
    return _stripe_service
