"use server";

import { signIn, signOut } from "../../../auth";
import { AuthError } from "next-auth";
import { prisma } from "../../lib/prisma";
import { LoginSchema, formDataToObject } from "../../lib/validators";
import { ROLES } from "../../lib/constants";
import { checkRateLimit, getCallerIp } from "../../lib/rateLimit";

export async function loginAction(prevState: unknown, formData: FormData) {
  // Rate limit: 10 attempts per 15 minutes per IP
  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`login:${ip}`, 10, 15 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many login attempts. Please try again in 15 minutes." };
  }

  // Validate input
  const parsed = LoginSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] || "Invalid input";
    return { success: false, error: firstError };
  }

  const { email } = parsed.data;

  // Determine their role before logging in to route them correctly
  const user = await prisma.user.findFirst({
    where: { email },
    select: { role: true },
  });

  if (user?.role === ROLES.ADMIN) {
    formData.set("redirectTo", "/admin");
  } else {
    formData.set("redirectTo", "/account");
  }

  try {
    await signIn("credentials", formData);
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { success: false, error: "Invalid credentials." };
        default:
          return { success: false, error: "Something went wrong." };
      }
    }
    throw error;
  }
}

export async function logoutAction() {
  await signOut();
}

export async function googleSignInAction() {
  await signIn("google", { redirectTo: "/account" });
}

export async function resendSignInAction(formData: FormData) {
  await signIn("resend", formData);
}
