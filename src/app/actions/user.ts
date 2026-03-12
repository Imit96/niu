"use server";

import crypto from "crypto";
import { auth } from "../../../auth";
import { prisma } from "../../lib/prisma";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { sendPasswordResetEmail } from "@/lib/email";
import { logger } from "@/lib/logger";
import { PASSWORD_RESET_EXPIRY_HOURS, ROLES } from "@/lib/constants";

import { requireAdmin } from "../../lib/auth-utils";

const ProfileUpdateSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  currentPassword: z.string().optional(),
  newPassword: z.string().min(8, "Password must be at least 8 characters.").optional(),
}).refine(data => {
  // If they provide a new password, they MUST provide the current one
  if (data.newPassword && !data.currentPassword) {
    return false; // Validates as false
  }
  return true;
}, {
  message: "Current password is required to set a new password.",
  path: ["currentPassword"],
});

export async function updateProfile(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return { error: "Unauthorized." };
    }

    const nameRaw = formData.get("name");
    const currentPasswordRaw = formData.get("currentPassword");
    const newPasswordRaw = formData.get("newPassword");

    const validatedData = ProfileUpdateSchema.safeParse({
      name: nameRaw,
      currentPassword: currentPasswordRaw || undefined,
      newPassword: newPasswordRaw || undefined,
    });

    if (!validatedData.success) {
      return { error: validatedData.error.issues[0].message };
    }

    const { name, currentPassword, newPassword } = validatedData.data;

    // Fetch full user record to check passwords
    const user = await prisma.user.findFirst({
      where: { id: session.user.id },
    });

    if (!user) return { error: "User not found." };

    let updatedPasswordHash = user.password; // Keep old if not changing

    // If changing password, verify old password first
    if (newPassword && currentPassword) {
      // Users that signed up via Google won't have a password. 
      // If they try to set one without having an old one, fail gracefully or allow setting (complex).
      // For now, assume they must have a password to change it, or we block it.
      if (!user.password) {
         return { error: "Accounts registered via Google/OAuth cannot change passwords this way." };
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return { error: "Incorrect current password." };
      }

      updatedPasswordHash = await bcrypt.hash(newPassword, 10);
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        name,
        password: updatedPasswordHash,
        // If the password was changed, increment passwordVersion to invalidate
        // all other active JWT sessions (on other devices)
        ...(newPassword ? { passwordVersion: { increment: 1 } } : {}),
      },
    });

    revalidatePath("/account");
    return { success: true };

  } catch (error) {
    logger.error("[Update Profile Error]", error);
    return { error: "Failed to update profile. Please try again." };
  }
}

// ─── Admin actions ─────────────────────────────────────────────────────────────

export async function adminUpdateUserEmail(
  userId: string,
  newEmail: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await requireAdmin();

    const parsed = z.email("Invalid email address.").safeParse(newEmail.trim());
    if (!parsed.success) return { error: parsed.error.issues[0].message };

    const existing = await prisma.user.findFirst({ where: { email: parsed.data } });
    if (existing && existing.id !== userId) {
      return { error: "That email address is already in use by another account." };
    }

    await prisma.user.update({ where: { id: userId }, data: { email: parsed.data } });
    revalidatePath(`/admin/users/${userId}`);
    return { success: true };
  } catch {
    return { error: "Failed to update email. Please try again." };
  }
}

export async function adminSendPasswordReset(
  userId: string
): Promise<{ success?: boolean; error?: string }> {
  try {
    await requireAdmin();

    const user = await prisma.user.findFirst({ where: { id: userId }, select: { email: true, name: true, password: true } });
    if (!user) return { error: "User not found." };
    if (!user.password) return { error: "This account uses Google/OAuth login and has no password to reset." };

    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + PASSWORD_RESET_EXPIRY_HOURS * 60 * 60 * 1000);

    await prisma.verificationToken.deleteMany({ where: { identifier: user.email! } });
    await prisma.verificationToken.create({ data: { identifier: user.email!, token, expires } });

    const baseUrl = process.env.APP_URL ?? (process.env.NODE_ENV === "production" ? "https://origonae.com" : "http://localhost:3000");
    const resetUrl = `${baseUrl}/auth/reset-password?token=${token}&email=${encodeURIComponent(user.email!)}`;
    const firstName = user.name?.split(" ")[0] ?? "there";

    sendPasswordResetEmail({ to: user.email!, firstName, resetUrl }).catch((err) =>
      logger.error("[Email] adminSendPasswordReset failed", err)
    );

    return { success: true };
  } catch {
    return { error: "Failed to send reset email. Please try again." };
  }
}
