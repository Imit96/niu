/**
 * Unit tests for the Paystack webhook handler.
 *
 * These tests cover the security-critical paths:
 *   1. Signature verification rejects invalid requests
 *   2. Replay protection ignores already-processed events
 *   3. Amount verification rejects underpayments
 *   4. Valid events mark orders as PAID
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import crypto from "crypto";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockOrderFindFirst = vi.fn();
const mockOrderUpdate = vi.fn();
const mockOrderAuditLogCreate = vi.fn();
const mockProcessedWebhookEventCreate = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    order: { findFirst: mockOrderFindFirst, update: mockOrderUpdate },
    orderAuditLog: { create: mockOrderAuditLogCreate },
    processedWebhookEvent: { create: mockProcessedWebhookEventCreate },
  },
}));

vi.mock("@/lib/email", () => ({
  sendOrderConfirmationEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/logger", () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn() },
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

const SECRET = "test_paystack_secret";

function makeRequest(body: object, secret = SECRET): Request {
  const rawBody = JSON.stringify(body);
  const sig = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return new Request("http://localhost/api/webhooks/paystack", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-paystack-signature": sig,
    },
    body: rawBody,
  });
}

function chargeSuccessEvent(overrides: Record<string, unknown> = {}) {
  return {
    id: "evt_test_001",
    event: "charge.success",
    data: {
      reference: "ord_order123_1700000000000",
      amount: 500000, // 5000 NGN in kobo
      ...overrides,
    },
  };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("POST /api/webhooks/paystack", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    process.env.PAYSTACK_SECRET_KEY = SECRET;
    // Default: no duplicate event
    mockProcessedWebhookEventCreate.mockResolvedValue({});
    // Default: audit log succeeds
    mockOrderAuditLogCreate.mockResolvedValue({});
    // Default: order update succeeds
    mockOrderUpdate.mockResolvedValue({ id: "order123" });
  });

  it("rejects requests with invalid signature", async () => {
    const { POST } = await import("@/app/api/webhooks/paystack/route");
    const rawBody = JSON.stringify(chargeSuccessEvent());
    const req = new Request("http://localhost/api/webhooks/paystack", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-paystack-signature": "invalid_signature",
      },
      body: rawBody,
    });

    const res = await POST(req as never);
    expect(res.status).toBe(401);
    const json = await res.json();
    expect(json.error).toBe("Invalid signature");
  });

  it("returns 200 and skips processing for duplicate event IDs", async () => {
    const { POST } = await import("@/app/api/webhooks/paystack/route");
    // Simulate unique constraint violation (duplicate event)
    mockProcessedWebhookEventCreate.mockRejectedValue(
      Object.assign(new Error("Unique constraint"), { code: "P2002" })
    );

    const res = await POST(makeRequest(chargeSuccessEvent()) as never);
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.duplicate).toBe(true);
    expect(mockOrderFindFirst).not.toHaveBeenCalled();
  });

  it("rejects charge.success when paid amount is less than order total", async () => {
    const { POST } = await import("@/app/api/webhooks/paystack/route");
    mockOrderFindFirst.mockResolvedValue({
      id: "order123",
      status: "PENDING",
      totalInCents: 600000, // expects 6000 NGN
    });

    const event = chargeSuccessEvent({ amount: 500000 }); // only paid 5000 NGN
    const res = await POST(makeRequest(event) as never);
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toBe("Payment amount insufficient");
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it("marks order as PAID when signature, amount, and event are valid", async () => {
    const { POST } = await import("@/app/api/webhooks/paystack/route");
    mockOrderFindFirst.mockResolvedValue({
      id: "order123",
      status: "PENDING",
      totalInCents: 500000,
    });

    const res = await POST(makeRequest(chargeSuccessEvent()) as never);
    expect(res.status).toBe(200);
    expect(mockOrderUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ status: "PAID" }),
      })
    );
  });

  it("is idempotent — skips update when order is already PAID", async () => {
    const { POST } = await import("@/app/api/webhooks/paystack/route");
    mockOrderFindFirst.mockResolvedValue({
      id: "order123",
      status: "PAID", // already processed
      totalInCents: 500000,
    });

    const res = await POST(makeRequest(chargeSuccessEvent()) as never);
    expect(res.status).toBe(200);
    expect(mockOrderUpdate).not.toHaveBeenCalled();
  });

  it("returns 404 when the referenced order does not exist", async () => {
    const { POST } = await import("@/app/api/webhooks/paystack/route");
    mockOrderFindFirst.mockResolvedValue(null);

    const res = await POST(makeRequest(chargeSuccessEvent()) as never);
    expect(res.status).toBe(404);
  });
});
