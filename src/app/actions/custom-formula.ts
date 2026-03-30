"use server";

import { prisma } from "@/lib/prisma";
import { CustomFormulaRequestSchema, formDataToObject } from "@/lib/validators";
import { checkRateLimit, getCallerIp } from "@/lib/rateLimit";
import { sendAdminFormulaRequestNotification } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function submitCustomFormulaRequest(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const ip = await getCallerIp();
  const rl = await checkRateLimit(`formula:${ip}`, 3, 60 * 60 * 1000); // 3 per hour
  if (!rl.allowed) {
    return { success: false, error: "Too many requests. Please try again later." };
  }

  const raw = formDataToObject(formData);
  const parsed = CustomFormulaRequestSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid form data.";
    return { success: false, error: firstError };
  }

  try {
    await (prisma.customFormulaRequest.create as any)({
      data: {
        name: parsed.data.name,
        email: parsed.data.email,
        hairConcern: parsed.data.hairConcern,
        texture: parsed.data.texture ?? null,
        notes: parsed.data.notes ?? null,
      },
    });

    // Notify admin — fire and forget (non-blocking, errors logged internally)
    sendAdminFormulaRequestNotification({
      submitterName: parsed.data.name,
      submitterEmail: parsed.data.email,
      concern: parsed.data.hairConcern,
      texture: parsed.data.texture ?? null,
      notes: parsed.data.notes ?? null,
    }).catch((err) => logger.error("[CustomFormula] Admin notification failed:", err));

    return { success: true };
  } catch {
    return { success: false, error: "Failed to submit. Please try again." };
  }
}

export async function getCustomFormulaRequests() {
  return (prisma.customFormulaRequest.findMany as any)({
    orderBy: { createdAt: "desc" },
  });
}

export async function markFormulaRequestReviewed(id: string) {
  return (prisma.customFormulaRequest.update as any)({
    where: { id },
    data: { isReviewed: true },
  });
}
