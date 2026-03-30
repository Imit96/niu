"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useEffect } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { resetPassword } from "@/app/actions/passwordReset";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";

  const [state, action, isPending] = useActionState(resetPassword, null);

  useEffect(() => {
    if ((state as any)?.success) {
      setTimeout(() => {
        window.location.href = "/auth/login?reset=success";
      }, 1500);
    }
  }, [state]);

  if (!token || !email) {
    return (
      <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
        <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm text-center space-y-4">
          <p className="text-earth font-serif text-xl">Invalid reset link.</p>
          <Link href="/auth/forgot-password" className="text-bronze hover:underline underline-offset-4 text-sm">
            Request a new link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
      <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest text-center mb-2">
          New Password
        </h1>
        <p className="text-center text-earth/70 text-sm mb-8">
          Choose a password of at least 8 characters.
        </p>

        {(state as any)?.success ? (
          <div className="p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center">
            Password updated. Redirecting to sign in…
          </div>
        ) : (
          <form action={action} className="space-y-6">
            {(state as any)?.error && (
              <div className="p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {(state as any).error}
              </div>
            )}
            {/* Pass token and email as hidden fields */}
            <input type="hidden" name="token" value={token} />
            <input type="hidden" name="email" value={email} />
            <Input
              type="password"
              name="password"
              placeholder="New Password"
              required
              disabled={isPending}
            />
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              disabled={isPending}
            />
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? "Updating..." : "Update Password"}
            </Button>
          </form>
        )}

        <div className="mt-8 text-center text-sm text-earth/80">
          <Link href="/auth/login" className="text-bronze hover:underline underline-offset-4">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
