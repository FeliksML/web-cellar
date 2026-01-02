"""Email service for sending notifications."""

import logging
from typing import Any

from src.config import get_settings

logger = logging.getLogger(__name__)


class EmailService:
    """Service for sending emails."""

    def __init__(self):
        self.settings = get_settings()
        self.from_email = self.settings.EMAIL_FROM_ADDRESS
        self.provider = self.settings.EMAIL_PROVIDER

    async def send_email(
        self,
        to: str | list[str],
        subject: str,
        html_content: str,
        text_content: str | None = None,
    ) -> bool:
        """
        Send an email.

        Args:
            to: Recipient email(s)
            subject: Email subject
            html_content: HTML body
            text_content: Plain text body (optional)

        Returns:
            True if sent successfully
        """
        recipients = [to] if isinstance(to, str) else to

        if self.provider == "resend":
            return await self._send_via_resend(recipients, subject, html_content)
        elif self.provider == "console":
            # Development mode - just log
            logger.info(f"EMAIL to {recipients}: {subject}")
            logger.debug(f"Content: {html_content[:500]}...")
            return True
        else:
            logger.warning(f"Unknown email provider: {self.provider}")
            return False

    async def _send_via_resend(
        self,
        recipients: list[str],
        subject: str,
        html_content: str,
    ) -> bool:
        """Send email via Resend API."""
        try:
            import resend

            resend.api_key = self.settings.EMAIL_API_KEY

            resend.Emails.send(
                {
                    "from": self.from_email,
                    "to": recipients,
                    "subject": subject,
                    "html": html_content,
                }
            )
            return True
        except Exception as e:
            logger.error(f"Failed to send email via Resend: {e}")
            return False

    async def send_order_confirmation(
        self,
        to: str,
        order_number: str,
        order_data: dict[str, Any],
    ) -> bool:
        """Send order confirmation email."""
        subject = f"Order Confirmed - {order_number}"
        html_content = self._render_order_confirmation(order_number, order_data)
        return await self.send_email(to, subject, html_content)

    async def send_order_status_update(
        self,
        to: str,
        order_number: str,
        new_status: str,
        order_data: dict[str, Any],
    ) -> bool:
        """Send order status update email."""
        status_messages = {
            "confirmed": "Your order has been confirmed",
            "preparing": "We're preparing your order",
            "ready": "Your order is ready",
            "out_for_delivery": "Your order is on its way",
            "delivered": "Your order has been delivered",
            "cancelled": "Your order has been cancelled",
        }
        message = status_messages.get(new_status, f"Order status: {new_status}")
        subject = f"{message} - {order_number}"
        html_content = self._render_status_update(order_number, new_status, order_data)
        return await self.send_email(to, subject, html_content)

    def _render_order_confirmation(
        self,
        order_number: str,
        order_data: dict[str, Any],
    ) -> str:
        """Render order confirmation email template."""
        items_html = ""
        for item in order_data.get("items", []):
            items_html += f"""
            <tr>
                <td style="padding: 10px; border-bottom: 1px solid #eee;">
                    {item['product_name']} x {item['quantity']}
                </td>
                <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">
                    ${item['subtotal']:.2f}
                </td>
            </tr>
            """

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Order Confirmation</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B4513;">Thank you for your order!</h1>
            <p>Your order <strong>{order_number}</strong> has been received.</p>

            <h2>Order Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
                {items_html}
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Subtotal</td>
                    <td style="padding: 10px; text-align: right;">${order_data.get('subtotal', 0):.2f}</td>
                </tr>
                <tr>
                    <td style="padding: 10px; font-weight: bold;">Shipping</td>
                    <td style="padding: 10px; text-align: right;">${order_data.get('shipping_cost', 0):.2f}</td>
                </tr>
                <tr style="background: #f9f9f9;">
                    <td style="padding: 10px; font-weight: bold; font-size: 18px;">Total</td>
                    <td style="padding: 10px; text-align: right; font-size: 18px;">${order_data.get('total', 0):.2f}</td>
                </tr>
            </table>

            <h2>Delivery Information</h2>
            <p>
                <strong>Date:</strong> {order_data.get('requested_date')}<br>
                <strong>Time:</strong> {order_data.get('requested_time_slot', 'Standard delivery')}
            </p>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you have any questions, please reply to this email.
            </p>

            <p style="color: #8B4513;">
                <strong>Beasty Baker</strong>
            </p>
        </body>
        </html>
        """

    def _render_status_update(
        self,
        order_number: str,
        status: str,
        order_data: dict[str, Any],
    ) -> str:
        """Render order status update email template."""
        status_emoji = {
            "confirmed": "✓",
            "preparing": "👨‍🍳",
            "ready": "📦",
            "out_for_delivery": "🚗",
            "delivered": "🎉",
            "cancelled": "❌",
        }
        emoji = status_emoji.get(status, "📋")

        return f"""
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="utf-8">
            <title>Order Update</title>
        </head>
        <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #8B4513;">{emoji} Order Update</h1>
            <p>Your order <strong>{order_number}</strong> status has been updated.</p>

            <div style="background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <p style="font-size: 18px; margin: 0;">
                    <strong>Status:</strong> {status.replace('_', ' ').title()}
                </p>
            </div>

            <p style="color: #666; font-size: 14px; margin-top: 30px;">
                If you have any questions, please reply to this email.
            </p>

            <p style="color: #8B4513;">
                <strong>Beasty Baker</strong>
            </p>
        </body>
        </html>
        """


# Singleton instance
_email_service: EmailService | None = None


def get_email_service() -> EmailService:
    """Get or create the Email service singleton."""
    global _email_service
    if _email_service is None:
        _email_service = EmailService()
    return _email_service
