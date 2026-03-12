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
} from "@react-email/components";

interface ShippingNotificationEmailProps {
  customerName: string;
  orderReference: string;
  ordersUrl: string;
}

export function ShippingNotificationEmail({
  customerName,
  orderReference,
  ordersUrl,
}: ShippingNotificationEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ORIGONÆ order is on its way — {orderReference}</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            ORIGONÆ
          </Heading>
          <Hr style={{ borderColor: "#c4a97a", margin: "20px 0" }} />

          <Heading as="h2" style={{ fontSize: "20px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em", margin: "0 0 8px" }}>
            Your Order Is On Its Way.
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Dear {customerName},
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Your ORIGONÆ order has been carefully prepared and dispatched. It is now on its way to you.
          </Text>

          <Text style={{ color: "#8a7060", fontSize: "12px", letterSpacing: "0.1em", textTransform: "uppercase", margin: "24px 0 4px" }}>
            Order Reference
          </Text>
          <Text style={{ color: "#3b2f22", fontSize: "14px", fontWeight: "bold", margin: "0 0 24px", letterSpacing: "0.05em" }}>
            {orderReference}
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Delivery times vary by location. If you have any questions about your shipment,
            please reach out to our care team and we will assist you promptly.
          </Text>

          <Link
            href={ordersUrl}
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
            View My Orders
          </Link>

          <Hr style={{ borderColor: "#c4a97a", margin: "32px 0 24px" }} />

          <Text style={{ color: "#8a7060", fontSize: "13px", lineHeight: "1.8" }}>
            Questions?{" "}
            <Link href="mailto:care@origonae.com" style={{ color: "#c4a97a" }}>
              care@origonae.com
            </Link>
          </Text>
          <Text style={{ color: "#8a7060", fontSize: "12px" }}>
            ORIGONÆ Client Care · care@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
