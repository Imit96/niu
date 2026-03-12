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

interface CartItem {
  name: string;
  size: string;
  quantity: number;
  priceInCents: number;
}

interface AbandonedCartEmailProps {
  firstName?: string;
  items: CartItem[];
  cartUrl: string;
}

function formatPrice(cents: number) {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(cents / 100);
}

export function AbandonedCartEmail({ firstName, items, cartUrl }: AbandonedCartEmailProps) {
  const totalInCents = items.reduce((sum, i) => sum + i.priceInCents * i.quantity, 0);

  return (
    <Html>
      <Head />
      <Preview>Your ORIGONÆ selection is waiting — complete your order</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={logo}>ORIGONÆ</Heading>
          <Hr style={divider} />

          <Section style={section}>
            <Text style={text}>
              {firstName ? `Hello ${firstName},` : "Hello,"}
            </Text>
            <Text style={text}>
              You left something behind. Your selected items are still available — complete your
              order before stock runs low.
            </Text>
          </Section>

          {/* Item list */}
          <Section style={itemsSection}>
            {items.map((item, idx) => (
              <Section key={idx} style={itemRow}>
                <Text style={itemName}>
                  {item.name}
                  {item.size ? ` — ${item.size}` : ""}
                </Text>
                <Text style={itemMeta}>
                  Qty: {item.quantity} &nbsp;·&nbsp; {formatPrice(item.priceInCents * item.quantity)}
                </Text>
              </Section>
            ))}
            <Hr style={itemDivider} />
            <Text style={total}>Total &nbsp; {formatPrice(totalInCents)}</Text>
          </Section>

          <Button href={cartUrl} style={button}>
            Complete Your Order
          </Button>

          <Hr style={divider} />
          <Text style={footer}>
            ORIGONÆ — Grounded Luxury Haircare
          </Text>
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

const logo = {
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

const itemsSection = {
  backgroundColor: "#F4EFE8",
  padding: "20px 24px",
  margin: "16px 0",
};

const itemRow = {
  marginBottom: "12px",
};

const itemName = {
  fontSize: "14px",
  color: "#3A2F2A",
  margin: "0",
  fontWeight: "bold",
};

const itemMeta = {
  fontSize: "13px",
  color: "#8A7F76",
  margin: "2px 0 0",
};

const itemDivider = {
  borderColor: "#E8E3DC",
  margin: "16px 0 12px",
};

const total = {
  fontSize: "15px",
  color: "#3A2F2A",
  fontWeight: "bold",
  margin: "0",
  textAlign: "right" as const,
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
