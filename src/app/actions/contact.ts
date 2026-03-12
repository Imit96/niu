"use server";

import { ContactSchema, formDataToObject } from "@/lib/validators";
import { sendContactEmail } from "@/lib/email";
import { checkRateLimit, getCallerIp } from "@/lib/rateLimit";

export async function submitContactForm(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const ip = await getCallerIp();
  const rl = await checkRateLimit(`contact:${ip}`, 5, 60 * 60 * 1000); // 5 per hour
  if (!rl.allowed) {
    return { success: false, error: "Too many messages. Please try again later." };
  }

  const raw = formDataToObject(formData);
  const parsed = ContactSchema.safeParse(raw);

  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Invalid form data.";
    return { success: false, error: firstError };
  }

  const { firstName, lastName, email, inquiryType, message } = parsed.data;

  try {
    await sendContactEmail({ firstName, lastName, email, inquiryType, message });
    return { success: true };
  } catch {
    return { success: false, error: "Failed to send your message. Please try again or email us directly." };
  }
}
