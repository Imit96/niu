import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface WishlistRestockEmailProps {
  customerName: string;
  productName: string;
  productUrl: string;
}

export function WishlistRestockEmail({
  customerName,
  productName,
  productUrl,
}: WishlistRestockEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>{productName} is back in stock — shop now before it sells out</Preview>
      <Body style={{ backgroundColor: "#FAF7F2", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "40px 24px" }}>
          <Heading
            style={{
              fontSize: "22px",
              fontWeight: "400",
              letterSpacing: "0.08em",
              color: "#1C1C1C",
              textTransform: "uppercase",
              marginBottom: "8px",
            }}
          >
            ORIGONÆ
          </Heading>

          <Section style={{ marginTop: "32px" }}>
            <Text style={{ fontSize: "16px", color: "#1C1C1C", lineHeight: "1.6" }}>
              Dear {customerName},
            </Text>
            <Text style={{ fontSize: "16px", color: "#1C1C1C", lineHeight: "1.6" }}>
              Good news — <strong>{productName}</strong>, which you saved to your wishlist, is back
              in stock. Quantities are limited, so we wanted to let you know first.
            </Text>
          </Section>

          <Section style={{ textAlign: "center", marginTop: "32px" }}>
            <Button
              href={productUrl}
              style={{
                backgroundColor: "#1C1C1C",
                color: "#FAF7F2",
                padding: "14px 32px",
                fontSize: "12px",
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Shop Now
            </Button>
          </Section>

          <Text
            style={{
              fontSize: "12px",
              color: "#888",
              marginTop: "40px",
              borderTop: "1px solid #E8E2D9",
              paddingTop: "16px",
            }}
          >
            You received this email because you wishlisted this product on ORIGONÆ.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
