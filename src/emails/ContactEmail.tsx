import {
  Html,
  Head,
  Body,
  Container,
  Heading,
  Text,
  Hr,
  Preview,
} from "@react-email/components";

interface ContactEmailProps {
  firstName: string;
  lastName: string;
  email: string;
  inquiryType: string;
  message: string;
}

const INQUIRY_LABELS: Record<string, string> = {
  order: "Order Support",
  product: "Product Inquiry",
  press: "Press & PR",
  wholesale: "Wholesale & Salon",
  other: "Other",
};

export function ContactEmail({
  firstName,
  lastName,
  email,
  inquiryType,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Client Care Inquiry from {firstName} {lastName}</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ORIGONÆ
          </Heading>
          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Heading as="h2" style={{ fontSize: "18px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em" }}>
            New Client Care Inquiry
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
            <strong>From:</strong> {firstName} {lastName}
          </Text>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
            <strong>Email:</strong> {email}
          </Text>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0 0 16px" }}>
            <strong>Subject:</strong> {INQUIRY_LABELS[inquiryType] ?? inquiryType}
          </Text>

          <Hr style={{ borderColor: "#e8e0d8", margin: "16px 0" }} />

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px", whiteSpace: "pre-wrap" }}>
            {message}
          </Text>

          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Text style={{ color: "#8a7060", fontSize: "12px" }}>
            Reply directly to this email to respond to the client.
          </Text>
          <Text style={{ color: "#8a7060", fontSize: "12px" }}>
            ORIGONÆ Client Care · care@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
