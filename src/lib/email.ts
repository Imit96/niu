import { Resend } from "resend";
import { SalonApprovalEmail } from "../emails/SalonApprovalEmail";
import { SalonRejectionEmail } from "../emails/SalonRejectionEmail";
import { ContactEmail } from "../emails/ContactEmail";
import { OrderConfirmationEmail } from "../emails/OrderConfirmationEmail";
import { WelcomeEmail } from "../emails/WelcomeEmail";
import { ShippingNotificationEmail } from "../emails/ShippingNotificationEmail";
import { PasswordResetEmail } from "../emails/PasswordResetEmail";
import { AdminNewOrderEmail } from "../emails/AdminNewOrderEmail";
import { AdminFormulaRequestEmail } from "../emails/AdminFormulaRequestEmail";
import { prisma } from "./prisma";
import { logger } from "./logger";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = process.env.FROM_EMAIL || "ORIGONÆ <noreply@origonae.com>";
// APP_URL is enforced as required in production by env.ts — the localhost fallback
// is only reachable in development where env.ts allows APP_URL to be unset.
const APP_URL = process.env.APP_URL ?? "http://localhost:3000";

export async function sendSalonApprovalEmail({
  to,
  businessName,
  contactName,
  isExistingAccount = false,
}: {
  to: string;
  businessName: string;
  contactName: string;
  isExistingAccount?: boolean;
}) {
  const actionUrl = isExistingAccount
    ? `${APP_URL}/auth/login`
    : `${APP_URL}/auth/register`;

  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Your ORIGONÆ Partnership Application Has Been Approved",
      react: SalonApprovalEmail({ businessName, contactName, actionUrl, isExistingAccount }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send salon approval email:", error);
  }
}

export async function sendContactEmail({
  firstName,
  lastName,
  email,
  inquiryType,
  message,
}: {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
}) {
  const CARE_EMAIL = process.env.CARE_EMAIL || "care@origonae.com";

  try {
    await resend.emails.send({
      from: FROM,
      to: CARE_EMAIL,
      replyTo: email,
      subject: `Client Care Inquiry — ${firstName} ${lastName}`,
      react: ContactEmail({ firstName, lastName, email, inquiryType, message }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send contact email:", error);
    throw error;
  }
}

export async function sendOrderConfirmationEmail(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        user: { select: { email: true } },
        orderItems: {
          include: {
            variant: {
              include: { product: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!order) {
      logger.error("[Email] Order not found for confirmation email:", orderId);
      return;
    }

    const to = order.guestEmail ?? order.user?.email;
    if (!to) {
      logger.error("[Email] No email address found for order:", orderId);
      return;
    }

    const customerName = order.shippingName ?? "Valued Customer";

    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your ORIGONÆ Order Is Confirmed — ${order.paymentIntentId ?? order.id}`,
      react: OrderConfirmationEmail({
        customerName,
        orderReference: order.paymentIntentId ?? order.id,
        orderItems: order.orderItems.map((item) => ({
          productName: item.variant.product.name,
          variantSize: item.variant.size,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
        totalInCents: order.totalInCents,
        currency: order.currency,
        shippingAddress: {
          address: order.shippingAddress ?? "",
          apartment: order.shippingApartment,
          city: order.shippingCity ?? "",
          state: order.shippingState ?? "",
          postalCode: order.shippingPostalCode ?? "",
          country: order.shippingCountry ?? "",
        },
        shopUrl: `${APP_URL}/shop`,
      }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send order confirmation email:", error);
  }
}

export async function sendAdminNewOrderNotification(orderId: string) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.CARE_EMAIL || "care@origonae.com";

  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: {
        user: { select: { email: true, name: true } },
        orderItems: {
          include: {
            variant: {
              include: { product: { select: { name: true } } },
            },
          },
        },
      },
    });

    if (!order) {
      logger.error("[Email] Order not found for admin notification:", orderId);
      return;
    }

    const customerEmail = order.guestEmail ?? order.user?.email ?? "unknown";
    const customerName = order.shippingName ?? order.user?.name ?? "Guest";

    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Order — ${order.paymentIntentId ?? order.id} · ${customerName}`,
      react: AdminNewOrderEmail({
        orderReference: order.paymentIntentId ?? order.id,
        customerName,
        customerEmail,
        orderItems: order.orderItems.map((item) => ({
          productName: item.variant.product.name,
          variantSize: item.variant.size,
          quantity: item.quantity,
          priceAtPurchase: item.priceAtPurchase,
        })),
        totalInCents: order.totalInCents,
        currency: order.currency,
        shippingAddress: {
          address: order.shippingAddress ?? "",
          apartment: order.shippingApartment,
          city: order.shippingCity ?? "",
          state: order.shippingState ?? "",
          country: order.shippingCountry ?? "",
        },
        adminOrderUrl: `${APP_URL}/admin/orders`,
      }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send admin new order notification:", error);
  }
}

export async function sendAdminFormulaRequestNotification({
  submitterName,
  submitterEmail,
  concern,
  texture,
  notes,
}: {
  submitterName: string;
  submitterEmail: string;
  concern: string;
  texture?: string | null;
  notes?: string | null;
}) {
  const ADMIN_EMAIL = process.env.ADMIN_EMAIL || process.env.CARE_EMAIL || "care@origonae.com";

  try {
    await resend.emails.send({
      from: FROM,
      to: ADMIN_EMAIL,
      subject: `New Custom Formula Request — ${submitterName}`,
      react: AdminFormulaRequestEmail({
        submitterName,
        submitterEmail,
        concern,
        texture,
        notes,
        adminUrl: `${APP_URL}/admin/formula-requests`,
      }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send admin formula request notification:", error);
  }
}

export async function sendSalonRejectionEmail({
  to,
  businessName,
  contactName,
}: {
  to: string;
  businessName: string;
  contactName: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "An Update on Your ORIGONÆ Partnership Application",
      react: SalonRejectionEmail({ businessName, contactName }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send salon rejection email:", error);
  }
}

export async function sendWelcomeEmail({
  to,
  firstName,
}: {
  to: string;
  firstName: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Welcome to ORIGONÆ",
      react: WelcomeEmail({ firstName, shopUrl: `${APP_URL}/shop` }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send welcome email:", error);
  }
}

export async function sendShippingNotificationEmail(orderId: string) {
  try {
    const order = await prisma.order.findFirst({
      where: { id: orderId },
      include: { user: { select: { email: true } } },
    });

    if (!order) {
      logger.error("[Email] Order not found for shipping notification:", orderId);
      return;
    }

    const to = order.guestEmail ?? order.user?.email;
    if (!to) {
      logger.error("[Email] No email address found for order:", orderId);
      return;
    }

    await resend.emails.send({
      from: FROM,
      to,
      subject: `Your ORIGONÆ Order Has Been Dispatched — ${order.paymentIntentId ?? order.id}`,
      react: ShippingNotificationEmail({
        customerName: order.shippingName ?? "Valued Customer",
        orderReference: order.paymentIntentId ?? order.id,
        ordersUrl: `${APP_URL}/account/orders`,
      }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send shipping notification email:", error);
  }
}

export async function sendPasswordResetEmail({
  to,
  firstName,
  resetUrl,
}: {
  to: string;
  firstName: string;
  resetUrl: string;
}) {
  try {
    await resend.emails.send({
      from: FROM,
      to,
      subject: "Reset your ORIGONÆ password",
      react: PasswordResetEmail({ firstName, resetUrl }),
    });
  } catch (error) {
    logger.error("[Email] Failed to send password reset email:", error);
  }
}
