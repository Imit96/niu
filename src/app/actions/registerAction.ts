"use server";

import { prisma } from "../../lib/prisma";
import bcrypt from "bcryptjs";
import { RegisterSchema, formDataToObject } from "../../lib/validators";
import { sendWelcomeEmail } from "../../lib/email";
import { ROLES } from "../../lib/constants";
import { checkRateLimit, getCallerIp } from "../../lib/rateLimit";
import { logger } from "../../lib/logger";

export async function registerAction(prevState: unknown, formData: FormData) {
  // Rate limit: 5 registrations per hour per IP
  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`register:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return { error: "Too many registration attempts. Please try again in an hour." };
  }

  // Validate input
  const parsed = RegisterSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] || "Invalid input";
    return { error: firstError };
  }

  const { email, password, firstName, lastName, phone } = parsed.data;

  // Check if user exists
  const existingUser = await prisma.user.findFirst({
    where: { email },
  });

  if (existingUser) {
    return { error: "Email already in use" };
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    // Check for a pre-approved salon application matching this email
    const pendingSalon = await prisma.salonPartner.findFirst({
      where: { contactEmail: email, isApproved: true, userId: null },
      select: { id: true },
    });

    const user = await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        password: hashedPassword,
        phone: phone || null,
        role: pendingSalon ? ROLES.SALON : ROLES.CUSTOMER,
      },
    });

    // If an approved salon application exists, link it to this new account
    if (pendingSalon) {
      await prisma.salonPartner.update({
        where: { id: pendingSalon.id },
        data: { userId: user.id },
      });
    }

    // Non-blocking — log failures without surfacing them to the user
    sendWelcomeEmail({ to: email, firstName }).catch((err) =>
      logger.error("[Email] sendWelcomeEmail failed", err)
    );

    return { success: true, message: "Account created successfully" };
  } catch {
    return { error: "Something went wrong processing your request" };
  }
}
