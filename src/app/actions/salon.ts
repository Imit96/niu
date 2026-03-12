"use server";

import { prisma } from "../../lib/prisma";
import { auth } from "../../../auth";
import { SalonApplicationSchema, formDataToObject } from "../../lib/validators";
import { checkRateLimit, getCallerIp } from "../../lib/rateLimit";
import { logger } from "../../lib/logger";

export async function getSalonProfile() {
  const session = await auth();
  
  if (!session?.user?.id) {
    return null;
  }

  try {
    const profile = await prisma.salonPartner.findFirst({
      where: { userId: session.user.id },
      include: { pricingTier: true }
    });
    
    return profile;
  } catch (error) {
    logger.error("[Salon Profile Fetch Error]", error);
    return null;
  }
}

export async function submitSalonApplication(formData: FormData) {
  // Rate limit: 3 submissions per hour per IP
  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`salon-apply:${ip}`, 3, 60 * 60 * 1000);
  if (!allowed) {
    return { error: "Too many applications. Please try again later." };
  }

  // Validate input with Zod schema
  const parsed = SalonApplicationSchema.safeParse(formDataToObject(formData));
  if (!parsed.success) {
    const errors = parsed.error.flatten().fieldErrors;
    const firstError = Object.values(errors).flat()[0] || "Invalid application data.";
    return { error: firstError };
  }

  const { businessName, contactName, contactEmail, address, phone, instagramHandle, socialMediaLinks, message } = parsed.data;

  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (userId) {
      const existing = await prisma.salonPartner.findFirst({ where: { userId } });
      if (existing) {
        return { error: "You already have a submitted application linked to this account." };
      }
    }

    await prisma.salonPartner.create({
      data: {
        businessName,
        contactName,
        contactEmail,
        phone: phone || null,
        instagramHandle: instagramHandle || null,
        socialMediaLinks: socialMediaLinks || null,
        message: message || null,
        address,
        userId: userId || undefined,
      }
    });

    return { success: true };
  } catch (error) {
    logger.error("[Submit Salon Application Error]", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
}
