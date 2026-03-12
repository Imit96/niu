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

interface SalonRejectionEmailProps {
  businessName: string;
  contactName: string;
}

export function SalonRejectionEmail({
  businessName,
  contactName,
}: SalonRejectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>An Update on Your ORIGONÆ Partnership Application</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase" }}>
            ORIGONÆ
          </Heading>
          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Heading as="h2" style={{ fontSize: "20px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em" }}>
            Partnership Application Update
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Dear {contactName},
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Thank you for your interest in partnering with ORIGONÆ and for taking the time to submit an application for <strong>{businessName}</strong>.
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            After careful review, we are unable to move forward with your partnership application at this time. We receive a high volume of inquiries and selectively partner with salons whose profile aligns with our current strategic direction.
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            We encourage you to continue following our journey and to reapply in the future. You are always welcome to shop our full range as a valued retail customer.
          </Text>

          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px" }}>
            We appreciate your interest in ORIGONÆ.
          </Text>
          <Text style={{ color: "#8a7060", fontSize: "12px" }}>
            ORIGONÆ Client Care · care@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
