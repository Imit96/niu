/**
 * Unit tests for registerAction.
 * Covers: duplicate email, salon pre-approval linking, validation errors, rate limiting.
 */

import { describe, it, expect, vi, beforeEach } from "vitest";

// ─── Mocks ────────────────────────────────────────────────────────────────────

const mockUserFindFirst = vi.fn();
const mockUserCreate = vi.fn();
const mockSalonFindFirst = vi.fn();
const mockSalonUpdate = vi.fn();
const mockCheckRateLimit = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: { findFirst: mockUserFindFirst, create: mockUserCreate },
    salonPartner: { findFirst: mockSalonFindFirst, update: mockSalonUpdate },
  },
}));

vi.mock("@/lib/email", () => ({
  sendWelcomeEmail: vi.fn().mockResolvedValue(undefined),
}));

vi.mock("@/lib/rateLimit", () => ({
  getCallerIp: vi.fn().mockResolvedValue("127.0.0.1"),
  checkRateLimit: mockCheckRateLimit,
}));

// ─── Helpers ──────────────────────────────────────────────────────────────────

function makeFormData(overrides: Record<string, string> = {}) {
  const defaults: Record<string, string> = {
    firstName: "Ada",
    lastName: "Obi",
    email: "ada@example.com",
    password: "SecurePass123!",
    confirmPassword: "SecurePass123!",
  };
  const fd = new FormData();
  for (const [k, v] of Object.entries({ ...defaults, ...overrides })) {
    fd.append(k, v);
  }
  return fd;
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe("registerAction", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockCheckRateLimit.mockResolvedValue({ allowed: true, remaining: 4 });
    mockUserFindFirst.mockResolvedValue(null);
    mockSalonFindFirst.mockResolvedValue(null);
    mockUserCreate.mockResolvedValue({
      id: "user_01",
      email: "ada@example.com",
      role: "CUSTOMER",
    });
  });

  it("returns error when email is already in use", async () => {
    const { registerAction } = await import("@/app/actions/registerAction");
    mockUserFindFirst.mockResolvedValue({ id: "existing_user" });

    const result = await registerAction(null, makeFormData());

    expect(result).toHaveProperty("error", "Email already in use");
    expect(mockUserCreate).not.toHaveBeenCalled();
  });

  it("returns success and creates a CUSTOMER account by default", async () => {
    const { registerAction } = await import("@/app/actions/registerAction");

    const result = await registerAction(null, makeFormData());

    expect(result).toHaveProperty("success", true);
    expect(mockUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: "CUSTOMER", email: "ada@example.com" }),
      })
    );
  });

  it("assigns SALON role and links partner record when a pre-approved salon exists for the email", async () => {
    const { registerAction } = await import("@/app/actions/registerAction");
    mockSalonFindFirst.mockResolvedValue({ id: "salon_01" });
    mockUserCreate.mockResolvedValue({ id: "user_02", email: "ada@example.com", role: "SALON" });

    const result = await registerAction(null, makeFormData());

    expect(result).toHaveProperty("success", true);
    expect(mockUserCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ role: "SALON" }),
      })
    );
    expect(mockSalonUpdate).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: "salon_01" },
        data: { userId: "user_02" },
      })
    );
  });

  it("returns a validation error for missing required fields", async () => {
    const { registerAction } = await import("@/app/actions/registerAction");
    const fd = new FormData();
    fd.append("email", "not-an-email");

    const result = await registerAction(null, fd);

    expect(result).toHaveProperty("error");
    expect(mockUserCreate).not.toHaveBeenCalled();
  });

  it("blocks registration when rate limit is exceeded", async () => {
    const { registerAction } = await import("@/app/actions/registerAction");
    mockCheckRateLimit.mockResolvedValue({ allowed: false, remaining: 0 });

    const result = await registerAction(null, makeFormData());

    expect(result).toHaveProperty("error");
    expect((result as { error: string }).error).toMatch(/too many/i);
    expect(mockUserCreate).not.toHaveBeenCalled();
  });
});
