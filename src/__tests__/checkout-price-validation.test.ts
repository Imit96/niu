/**
 * Unit tests for server-side price validation in createOrderFromCart.
 *
 * These tests verify that the checkout action rejects tampered prices
 * (the primary anti-fraud measure in the payment flow).
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockVariantFindMany = vi.fn();
const mockFlashSaleFindFirst = vi.fn();
const mockShippingRateFindFirst = vi.fn();
const mockDiscountCodeFindFirst = vi.fn();
const mockSalonPartnerFindFirst = vi.fn();
const mockTransaction = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    productVariant: { findMany: mockVariantFindMany },
    flashSale: { findFirst: mockFlashSaleFindFirst },
    shippingRate: { findFirst: mockShippingRateFindFirst },
    discountCode: { findFirst: mockDiscountCodeFindFirst },
    salonPartner: { findFirst: mockSalonPartnerFindFirst },
    $transaction: mockTransaction,
  },
}));

// Path from src/__tests__/ up 2 levels = project root (where auth.ts lives)
vi.mock("../../auth", () => ({
  auth: vi.fn().mockResolvedValue(null), // guest checkout
}));

vi.mock("@/lib/email", () => ({
  sendOrderConfirmationEmail: vi.fn(),
}));

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const validShipping = {
  email: "test@example.com",
  firstName: "Ada",
  lastName: "Obi",
  address: "12 Lagos Street",
  city: "Lagos",
  state: "Lagos",
  postalCode: "100001",
  country: "Nigeria",
};

const dbVariant = {
  id: "var_01",
  priceInCents: 500000,
  salePriceInCents: null,
  inventoryCount: 10,
};

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("createOrderFromCart — price validation", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    mockVariantFindMany.mockResolvedValue([dbVariant]);
    mockFlashSaleFindFirst.mockResolvedValue(null); // no active flash sale
    mockShippingRateFindFirst.mockResolvedValue(null);
    mockDiscountCodeFindFirst.mockResolvedValue(null);
    mockSalonPartnerFindFirst.mockResolvedValue(null);
  });

  it("rejects when client-supplied total is lower than server-calculated total (price tampering)", async () => {
    const { createOrderFromCart } = await import("@/app/actions/order");

    const cartItems = [{ productId: "prod_01", id: "var_01", priceInCents: 100, quantity: 1 }];
    // Client claims total = 100 kobo, server calculates 500,000 kobo
    const result = await createOrderFromCart(cartItems, 100, validShipping);

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/price mismatch/i);
    expect(mockTransaction).not.toHaveBeenCalled();
  });

  it("rejects when client-supplied total is higher than server-calculated total", async () => {
    const { createOrderFromCart } = await import("@/app/actions/order");

    const cartItems = [{ productId: "prod_01", id: "var_01", priceInCents: 999999, quantity: 1 }];
    const result = await createOrderFromCart(cartItems, 999999, validShipping);

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/price mismatch/i);
  });

  it("rejects stale cart items that no longer exist in the DB", async () => {
    const { createOrderFromCart } = await import("@/app/actions/order");
    mockVariantFindMany.mockResolvedValue([]); // variant not found

    const cartItems = [{ productId: "prod_01", id: "var_deleted", priceInCents: 500000, quantity: 1 }];
    const result = await createOrderFromCart(cartItems, 500000, validShipping);

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toBe("STALE_CART");
  });

  it("rejects when cart is empty", async () => {
    const { createOrderFromCart } = await import("@/app/actions/order");
    const result = await createOrderFromCart([], 0, validShipping);

    expect(result.success).toBe(false);
    expect((result as { error: string }).error).toMatch(/empty cart/i);
  });

  it("proceeds with correct total matching server calculation", async () => {
    const { createOrderFromCart } = await import("@/app/actions/order");
    mockTransaction.mockImplementation(async (fn: (tx: unknown) => Promise<unknown>) => {
      // Simulate successful transaction
      const fakeTx = {
        productVariant: {
          updateMany: vi.fn().mockResolvedValue({ count: 1 }),
        },
        order: {
          create: vi.fn().mockResolvedValue({ id: "order_new_01" }),
        },
      };
      return fn(fakeTx);
    });

    const cartItems = [{ productId: "prod_01", id: "var_01", priceInCents: 500000, quantity: 1 }];
    const result = await createOrderFromCart(cartItems, 500000, validShipping);

    expect(result.success).toBe(true);
    expect((result as { orderId: string }).orderId).toBe("order_new_01");
  });
});
