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

interface WelcomeEmailProps {
  firstName: string;
  shopUrl: string;
}

export function WelcomeEmail({ firstName, shopUrl }: WelcomeEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Welcome to ORIGONÆ — Your collection begins here.</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            ORIGONÆ
          </Heading>
          <Hr style={{ borderColor: "#c4a97a", margin: "20px 0" }} />

          <Heading as="h2" style={{ fontSize: "20px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em", margin: "0 0 8px" }}>
            Welcome, {firstName}.
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Your ORIGONÆ account has been created. We are glad to have you.
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            ORIGONÆ is a celebration of heritage and the beauty methods passed through generations.
            Every formulation is an invitation to slow down, to tend to yourself, and to honour
            the wisdom of botanical tradition.
          </Text>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "15px" }}>
            Explore our collection and find the regimen that is right for you.
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
            Explore the Collection
          </Link>

          <Hr style={{ borderColor: "#c4a97a", margin: "32px 0 24px" }} />

          <Text style={{ color: "#8a7060", fontSize: "13px", lineHeight: "1.8" }}>
            If you have any questions, our care team is always here —{" "}
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
