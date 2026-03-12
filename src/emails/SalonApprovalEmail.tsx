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

interface SalonApprovalEmailProps {
  businessName: string;
  contactName: string;
  actionUrl: string;
  isExistingAccount: boolean;
}

export function SalonApprovalEmail({
  businessName,
  contactName,
  actionUrl,
  isExistingAccount,
}: SalonApprovalEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your ORIGONÆ Partnership Application Has Been Approved</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ORIGONÆ
          </Heading>
          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Heading as="h2" style={{ fontSize: "20px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em" }}>
            Partnership Approved
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Dear {contactName},
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            We are delighted to inform you that <strong>{businessName}</strong> has been approved as an official ORIGONÆ Salon Partner.
            You now have access to exclusive wholesale pricing, curated package orders, and dedicated partner discounts.
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            {isExistingAccount
              ? "Your existing account has been upgraded to Salon Partner status. Sign in below to access your wholesale dashboard and begin placing partner orders."
              : "To activate your salon account and begin placing partner orders, please create your account using the link below. Use the same email address you applied with."}
          </Text>

          <Link
            href={actionUrl}
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
            {isExistingAccount ? "Sign In to Your Salon Account" : "Create Your Salon Account"}
          </Link>

          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px" }}>
            Welcome to the ORIGONÆ family. We look forward to growing together.
          </Text>
          <Text style={{ color: "#8a7060", fontSize: "12px" }}>
            ORIGONÆ Wholesale Concierge · care@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
