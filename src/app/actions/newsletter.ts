"use server";

import { prisma } from "@/lib/prisma";
import { NewsletterSchema } from "@/lib/validators";
import { checkRateLimit, getCallerIp } from "@/lib/rateLimit";

export async function subscribeToNewsletter(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const ip = await getCallerIp();
  const { allowed } = await checkRateLimit(`newsletter:${ip}`, 5, 60 * 60 * 1000);
  if (!allowed) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  const email = formData.get("email")?.toString() ?? "";
  const parsed = NewsletterSchema.safeParse({ email });

  if (!parsed.success) {
    return { success: false, error: "Please enter a valid email address." };
  }

  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email: parsed.data.email },
      update: {},
      create: { email: parsed.data.email },
    });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to subscribe. Please try again." };
  }
}
