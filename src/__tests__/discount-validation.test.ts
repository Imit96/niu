/**
 * Unit tests for validateDiscountCode.
 * Covers: not found, inactive, expired, percentage discount, fixed discount, cart cap.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockDiscountFindFirst = vi.fn();
const mockCheckRateLimit = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    discountCode: { findFirst: mockDiscountFindFirst },
  },
}));

vi.mock("@/lib/rateLimit", () => ({
  getCallerIp: vi.fn().mockResolvedValue("127.0.0.1"),
  checkRateLimit: mockCheckRateLimit,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFormData(code: string, cartTotalInCents: number) {
  const fd = new FormData();
  fd.append("code", code);
  fd.append("cartTotalInCents", String(cartTotalInCents));
  return fd;
}

const baseDiscount = {
  code: "SAVE10",
  isActive: true,
  expiresAt: null,
  discountPct: null,
  discountFixed: null,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("validateDiscountCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 19 });
  });

  it("returns error when code does not exist", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    mockDiscountFindFirst.mockResolvedValue(null);

    const result = await validateDiscountCode(makeFormData("FAKE", 100000));

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/not found/i);
  });

  it("returns error when code is inactive", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    mockDiscountFindFirst.mockResolvedValue({ ...baseDiscount, isActive: false });

    const result = await validateDiscountCode(makeFormData("SAVE10", 100000));

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/no longer active/i);
  });

  it("returns error when code is expired", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    const yesterday = new Date(Date.now() - 86_400_000).toISOString();
    mockDiscountFindFirst.mockResolvedValue({ ...baseDiscount, expiresAt: yesterday });

    const result = await validateDiscountCode(makeFormData("SAVE10", 100000));

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/expired/i);
  });

  it("calculates percentage discount correctly", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    mockDiscountFindFirst.mockResolvedValue({ ...baseDiscount, discountPct: 20 });

    const result = await validateDiscountCode(makeFormData("SAVE10", 500000));

    expect(result.success).toBe(true);
    const data = (result as { data: { discountAmountInCents: number; newTotalInCents: number } }).data;
    expect(data.discountAmountInCents).toBe(100000); // 20% of 500,000
    expect(data.newTotalInCents).toBe(400000);
  });

  it("calculates fixed discount correctly", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    mockDiscountFindFirst.mockResolvedValue({ ...baseDiscount, discountFixed: 50000 });

    const result = await validateDiscountCode(makeFormData("SAVE10", 200000));

    expect(result.success).toBe(true);
    const data = (result as { data: { discountAmountInCents: number; newTotalInCents: number } }).data;
    expect(data.discountAmountInCents).toBe(50000);
    expect(data.newTotalInCents).toBe(150000);
  });

  it("caps discount at cart total so new total is never negative", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    mockDiscountFindFirst.mockResolvedValue({ ...baseDiscount, discountFixed: 999999 });

    const result = await validateDiscountCode(makeFormData("SAVE10", 100000));

    expect(result.success).toBe(true);
    const data = (result as { data: { discountAmountInCents: number; newTotalInCents: number } }).data;
    expect(data.discountAmountInCents).toBe(100000);
    expect(data.newTotalInCents).toBe(0);
  });

  it("accepts a code with a future expiry date", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    const tomorrow = new Date(Date.now() + 86_400_000).toISOString();
    mockDiscountFindFirst.mockResolvedValue({ ...baseDiscount, discountPct: 10, expiresAt: tomorrow });

    const result = await validateDiscountCode(makeFormData("SAVE10", 100000));

    expect(result.success).toBe(true);
  });

  it("blocks validation when rate limit is exceeded", async () => {
    const { validateDiscountCode } = await import("@/app/actions/discount");
    mockCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });

    const result = await validateDiscountCode(makeFormData("SAVE10", 100000));

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/too many/i);
    expect(mockDiscountFindFirst).not.toHaveBeenCalled();
  });
});
