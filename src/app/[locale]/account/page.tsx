import { auth } from "../../../../auth";
import { redirect } from "next/navigation";
import { ProfileSettingsClient } from "@/components/shared/forms/ProfileSettingsClient";

export const metadata = {
  title: "My Account | ORIGONÆ",
  description: "Manage your profile, regimen details, and past orders.",
};

export default async function AccountPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/auth/login");
  }

  return (
    <ProfileSettingsClient 
      initialName={session.user.name || ""}
      initialEmail={session.user.email || ""}
    />
  );
}
