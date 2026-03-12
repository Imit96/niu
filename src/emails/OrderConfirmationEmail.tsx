import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Link,
  Preview,
  Section,
  Row,
  Column,
} from "@react-email/components";

interface OrderItem {
  productName: string;
  variantSize: string | null;
  quantity: number;
  priceAtPurchase: number; // in cents
}

interface OrderConfirmationEmailProps {
  customerName: string;
  orderReference: string;
  orderItems: OrderItem[];
  totalInCents: number;
  currency: string;
  shippingAddress: {
    address: string;
    apartment: string | null;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  shopUrl: string;
}

function formatPrice(cents: number, currency: string) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function OrderConfirmationEmail({
  customerName,
  orderReference,
  orderItems,
  totalInCents,
  currency,
  shippingAddress,
  shopUrl,
}: OrderConfirmationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ORIGONÆ order has been confirmed — {orderReference}</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            ORIGONÆ
          </Heading>
          <Hr style={{ borderColor: "#c4a97a", margin: "20px 0" }} />

          <Heading as="h2" style={{ fontSize: "20px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em", margin: "0 0 8px" }}>
            Order Confirmed
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Dear {customerName},
          </Text>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Thank you for your order. We have received your payment and will begin preparing your items.
          </Text>

          <Text style={{ color: "#8a7060", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "24px 0 8px" }}>
            Order Reference
          </Text>
          <Text style={{ color: "#3b2f22", fontSize: "14px", fontWeight: "bold", margin: "0 0 24px", letterSpacing: "0.05em" }}>
            {orderReference}
          </Text>

          {/* Order Items */}
          <Hr style={{ borderColor: "#e8e0d8", margin: "0 0 16px" }} />
          <Text style={{ color: "#8a7060", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 12px" }}>
            Items Ordered
          </Text>

          {orderItems.map((item, idx) => (
            <Section key={idx} style={{ marginBottom: "12px" }}>
              <Row>
                <Column style={{ width: "70%" }}>
                  <Text style={{ color: "#3b2f22", fontSize: "14px", margin: "0", lineHeight: "1.5" }}>
                    {item.productName}
                    {item.variantSize ? ` — ${item.variantSize}` : ""}
                  </Text>
                  <Text style={{ color: "#8a7060", fontSize: "12px", margin: "2px 0 0" }}>
                    Qty: {item.quantity}
                  </Text>
                </Column>
                <Column style={{ width: "30%", textAlign: "right" }}>
                  <Text style={{ color: "#3b2f22", fontSize: "14px", margin: "0" }}>
                    {formatPrice(item.priceAtPurchase * item.quantity, currency)}
                  </Text>
                </Column>
              </Row>
            </Section>
          ))}

          <Hr style={{ borderColor: "#e8e0d8", margin: "12px 0" }} />
          <Section>
            <Row>
              <Column style={{ width: "70%" }}>
                <Text style={{ color: "#3b2f22", fontSize: "15px", fontWeight: "bold", margin: "0" }}>Total</Text>
              </Column>
              <Column style={{ width: "30%", textAlign: "right" }}>
                <Text style={{ color: "#3b2f22", fontSize: "15px", fontWeight: "bold", margin: "0" }}>
                  {formatPrice(totalInCents, currency)}
                </Text>
              </Column>
            </Row>
          </Section>

          {/* Shipping Address */}
          <Hr style={{ borderColor: "#e8e0d8", margin: "24px 0 16px" }} />
          <Text style={{ color: "#8a7060", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 8px" }}>
            Shipping To
          </Text>
          <Text style={{ color: "#3b2f22", fontSize: "14px", lineHeight: "1.8", margin: "0" }}>
            {shippingAddress.address}
            {shippingAddress.apartment ? `, ${shippingAddress.apartment}` : ""}<br />
            {shippingAddress.city}, {shippingAddress.state} {shippingAddress.postalCode}<br />
            {shippingAddress.country}
          </Text>

          <Hr style={{ borderColor: "#c4a97a", margin: "32px 0 24px" }} />

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "14px" }}>
            You will receive a shipping notification once your order is dispatched. For any queries, reply to this email or contact us at{" "}
            <Link href="mailto:care@origonae.com" style={{ color: "#c4a97a" }}>care@origonae.com</Link>.
          </Text>

          <Link
            href={shopUrl}
            style={{
              display: "inline-block",
              backgroundColor: "#3b2f22",
              color: "#f5f0eb",
              padding: "14px 32px",
              textDecoration: "none",
              letterSpacing: "0.15em",
              fontSize: "11px",
              textTransform: "uppercase",
              margin: "16px 0",
            }}
          >
            Continue Shopping
          </Link>

          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />
          <Text style={{ color: "#8a7060", fontSize: "12px" }}>
            ORIGONÆ Client Care · care@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
