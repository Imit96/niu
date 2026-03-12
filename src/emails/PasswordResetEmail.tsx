import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface PasswordResetEmailProps {
  firstName: string;
  resetUrl: string;
}

export function PasswordResetEmail({ firstName, resetUrl }: PasswordResetEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Reset your ORIGONÆ password</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>ORIGONÆ</Heading>
          <Hr style={divider} />
          <Section style={section}>
            <Text style={text}>Hello {firstName},</Text>
            <Text style={text}>
              We received a request to reset the password for your ORIGONÆ account.
              Click the button below to choose a new password. This link is valid for 2 hours.
            </Text>
            <Button href={resetUrl} style={button}>
              Reset Password
            </Button>
            <Text style={smallText}>
              If you did not request a password reset, you can safely ignore this email.
              Your password will not change.
            </Text>
          </Section>
          <Hr style={divider} />
          <Text style={footer}>ORIGONÆ — Grounded Luxury Haircare</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#F4EFE8",
  fontFamily: "Georgia, serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "40px auto",
  padding: "40px",
  maxWidth: "560px",
  border: "1px solid #E8E3DC",
};

const heading = {
  fontSize: "22px",
  letterSpacing: "0.2em",
  textAlign: "center" as const,
  color: "#3A2F2A",
  textTransform: "uppercase" as const,
  marginBottom: "0",
};

const divider = {
  borderColor: "#E8E3DC",
  margin: "24px 0",
};

const section = {
  padding: "0 8px",
};

const text = {
  fontSize: "15px",
  lineHeight: "1.7",
  color: "#3A2F2A",
};

const smallText = {
  fontSize: "13px",
  lineHeight: "1.6",
  color: "#8A7F76",
  marginTop: "24px",
};

const button = {
  backgroundColor: "#3A2F2A",
  color: "#F4EFE8",
  padding: "14px 28px",
  fontSize: "13px",
  letterSpacing: "0.1em",
  textTransform: "uppercase" as const,
  textDecoration: "none",
  display: "block",
  textAlign: "center" as const,
  margin: "28px 0",
};

const footer = {
  fontSize: "12px",
  color: "#8A7F76",
  textAlign: "center" as const,
  letterSpacing: "0.1em",
};
