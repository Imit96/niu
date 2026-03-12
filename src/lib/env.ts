import { z } from "zod";

// Fail fast if NODE_TLS_REJECT_UNAUTHORIZED=0 is set in production.
// This flag disables TLS certificate verification globally and opens the app to MITM attacks.
if (typeof process !== "undefined" && process.env.NODE_ENV === "production" && process.env.NODE_TLS_REJECT_UNAUTHORIZED === "0") {
  throw new Error(
    "NODE_TLS_REJECT_UNAUTHORIZED=0 must never be set in production. Remove it from your environment variables."
  );
}

const envSchema = z.object({
  // Database
  DATABASE_URL: z.string().min(1, "DATABASE_URL is required"),
  DIRECT_URL: z.string().min(1, "DIRECT_URL is required"),

  // Auth
  AUTH_SECRET: z.string().min(1, "AUTH_SECRET is required"),

  // Email
  RESEND_API_KEY: z.string().min(1, "RESEND_API_KEY is required"),

  // Paystack
  PAYSTACK_SECRET_KEY: z.string().min(1, "PAYSTACK_SECRET_KEY is required"),
  NEXT_PUBLIC_PAYSTACK_KEY: z.string().min(1, "NEXT_PUBLIC_PAYSTACK_KEY is required"),

  // APP_URL — set to your production domain when available; email links depend on it
  APP_URL: z.string().url().optional(),

  // Optional — validated at the call site
  CLOUDINARY_CLOUD_NAME: z.string().optional(),
  CLOUDINARY_API_KEY: z.string().optional(),
  CLOUDINARY_API_SECRET: z.string().optional(),
  CRON_SECRET: z.string().optional(),
  FROM_EMAIL: z.string().optional(),
  CARE_EMAIL: z.string().email().optional(),
  ADMIN_EMAIL: z.string().email().optional(),
  NEXT_PUBLIC_SITE_URL: z.string().url().optional(),
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().optional(),
  NEXT_PUBLIC_META_PIXEL_ID: z.string().optional(),

  // Optional — Google OAuth
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),

  // Next.js runtime
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
});

function validateEnv() {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    const missing = parsed.error.issues
      .map((i) => `  - ${i.path.join(".")}: ${i.message}`)
      .join("\n");
    throw new Error(
      `\n\nMissing or invalid environment variables:\n${missing}\n\nFix your .env file and restart.\n`
    );
  }

  return parsed.data;
}

export const env = validateEnv();
