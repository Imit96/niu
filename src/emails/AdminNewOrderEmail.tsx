import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Preview,
  Link,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  variantSize: string | null;
  quantity: number;
  priceAtPurchase: number;
}

interface AdminNewOrderEmailProps {
  orderReference: string;
  customerName: string;
  customerEmail: string;
  orderItems: OrderItem[];
  totalInCents: number;
  currency: string;
  shippingAddress: {
    address: string;
    apartment?: string | null;
    city: string;
    state: string;
    country: string;
  };
  adminOrderUrl: string;
}

function formatCurrency(cents: number, currency: string) {
  const symbol = currency === "NGN" ? "₦" : currency === "USD" ? "$" : currency;
  return `${symbol}${(cents / 100).toLocaleString()}`;
}

export function AdminNewOrderEmail({
  orderReference,
  customerName,
  customerEmail,
  orderItems,
  totalInCents,
  currency,
  shippingAddress,
  adminOrderUrl,
}: AdminNewOrderEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Order — {orderReference} from {customerName}</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            ORIGONÆ
          </Heading>
          <Text style={{ color: "#8a7060", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 24px" }}>
            Admin · New Order
          </Text>
          <Hr style={{ borderColor: "#c4a97a", margin: "0 0 24px" }} />

          <Heading as="h2" style={{ fontSize: "18px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em", margin: "0 0 20px" }}>
            A new order has been placed
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
            <strong>Reference:</strong> {orderReference}
          </Text>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
            <strong>Customer:</strong> {customerName}
          </Text>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0 0 16px" }}>
            <strong>Email:</strong> {customerEmail}
          </Text>

          <Hr style={{ borderColor: "#e8e0d8", margin: "16px 0" }} />

          <Heading as="h3" style={{ fontSize: "13px", color: "#8a7060", fontWeight: "normal", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Order Items
          </Heading>

          {orderItems.map((item, i) => (
            <Text key={i} style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
              {item.quantity}× {item.productName}
              {item.variantSize ? ` (${item.variantSize})` : ""} — {formatCurrency(item.priceAtPurchase * item.quantity, currency)}
            </Text>
          ))}

          <Hr style={{ borderColor: "#e8e0d8", margin: "16px 0" }} />

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "14px", fontWeight: "bold", margin: "0 0 16px" }}>
            Total: {formatCurrency(totalInCents, currency)}
          </Text>

          <Heading as="h3" style={{ fontSize: "13px", color: "#8a7060", fontWeight: "normal", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
            Ship To
          </Heading>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0 0 16px", whiteSpace: "pre-line" }}>
            {shippingAddress.address}{shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ""}
            {"\n"}{shippingAddress.city}, {shippingAddress.state}
            {"\n"}{shippingAddress.country}
          </Text>

          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Link
            href={adminOrderUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#3b2f22",
              color: "#f5f0eb",
              padding: "12px 28px",
              fontSize: "12px",
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              textDecoration: "none",
            }}
          >
            View Order in Admin
          </Link>

          <Text style={{ color: "#8a7060", fontSize: "12px", marginTop: "24px" }}>
            ORIGONÆ Admin Notifications · orders@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
