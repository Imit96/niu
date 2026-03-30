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

interface AdminFormulaRequestEmailProps {
  submitterName: string;
  submitterEmail: string;
  concern: string;
  texture?: string | null;
  notes?: string | null;
  adminUrl: string;
}

export function AdminFormulaRequestEmail({
  submitterName,
  submitterEmail,
  concern,
  texture,
  notes,
  adminUrl,
}: AdminFormulaRequestEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New Custom Formula Request from {submitterName}</Preview>
      <Body style={{ backgroundColor: "#f5f0eb", fontFamily: "Georgia, serif" }}>
        <Container style={{ maxWidth: "560px", margin: "0 auto", padding: "48px 24px" }}>
          <Heading style={{ fontSize: "32px", color: "#3b2f22", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>
            ORIGONÆ
          </Heading>
          <Text style={{ color: "#8a7060", fontSize: "11px", letterSpacing: "0.15em", textTransform: "uppercase", margin: "0 0 24px" }}>
            Admin · Custom Formula Request
          </Text>
          <Hr style={{ borderColor: "#c4a97a", margin: "0 0 24px" }} />

          <Heading as="h2" style={{ fontSize: "18px", color: "#3b2f22", fontWeight: "normal", letterSpacing: "0.05em", margin: "0 0 20px" }}>
            New Custom Formula Request
          </Heading>

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
            <strong>Name:</strong> {submitterName}
          </Text>
          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0 0 16px" }}>
            <strong>Email:</strong> {submitterEmail}
          </Text>

          <Hr style={{ borderColor: "#e8e0d8", margin: "16px 0" }} />

          <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
            <strong>Primary Concern:</strong> {concern}
          </Text>
          {texture && (
            <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0" }}>
              <strong>Texture / Type:</strong> {texture}
            </Text>
          )}
          {notes && (
            <Text style={{ color: "#3b2f22", lineHeight: "1.8", fontSize: "13px", margin: "0 0 16px", whiteSpace: "pre-wrap" }}>
              <strong>Notes:</strong> {notes}
            </Text>
          )}

          <Hr style={{ borderColor: "#c4a97a", margin: "24px 0" }} />

          <Link
            href={adminUrl}
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
            Review in Admin
          </Link>

          <Text style={{ color: "#8a7060", fontSize: "12px", marginTop: "24px" }}>
            ORIGONÆ Admin Notifications · care@origonae.com
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
