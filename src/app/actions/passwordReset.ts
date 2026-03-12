"use server";

import crypto from "crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";
import { ForgotPasswordSchema, ResetPasswordSchema, formDataToObject } from "@/lib/validators";
import { PASSWORD_RESET_EXPIRY_HOURS } from "@/lib/constants";
import { checkRateLimit, getCallerIp } from "@/lib/rateLimit";
import { logger } from "@/lib/logger";

export async function requestPasswordReset(prevState: unknown, formData: FormData) {
  // Rate limit: 5 requests per hour per IP
  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`pwreset:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return { error: "Too many requests. Please try again in an hour." };
  }

  const parsed = ForgotPasswordSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    return { error: "Please enter a valid email address." };
  }

  const { email } = parsed.data;

  try {
    const user = await prisma.user.findFirst({ where: { email } });

    // Always return success — never reveal whether the email exists
    if (!user || !user.password) {
      return { success: true };
    }

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

    // Upsert a verification token (reuse the NextAuth model)
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });
    await prisma.verificationToken.create({
      data: { identifier: email, token, expires },
    });

    const baseUrl = process.env.APP_URL ?? (process.env.NODE_ENV === "production" ? "https://origonae.com" : "http://localhost:3000");
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(email)}`;
    const firstName = user.name?.split(" ")[0] ?? "there";

    sendPasswordResetEmail({ to: email, firstName, resetUrl }).catch((err) =>
      logger.error("[Email] sendPasswordResetEmail failed", err)
    );

    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}

export async function resetPassword(prevState: unknown, formData: FormData) {
  const token = formData.get("token") as string;
  const email = formData.get("email") as string;

  if (!token || !email) {
    return { error: "Invalid reset link." };
  }

  const parsed = ResetPasswordSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] ?? "Invalid input.";
    return { error: firstError };
  }

  const { password } = parsed.data;

  try {
    const record = await prisma.verificationToken.findFirst({
      where: { identifier: email, token },
    });

    if (!record || record.expires < new Date()) {
      return { error: "This reset link has expired. Please request a new one." };
    }

    const hashed = await bcrypt.hash(password, 10);

    // Atomically update password AND increment passwordVersion so any existing
    // JWT sessions (on other devices) are invalidated on their next refresh.
    await prisma.user.updateMany({
      where: { email },
      data: { password: hashed, passwordVersion: { increment: 1 } },
    });
    await prisma.verificationToken.deleteMany({ where: { identifier: email } });

    return { success: true };
  } catch {
    return { error: "Something went wrong. Please try again." };
  }
}
