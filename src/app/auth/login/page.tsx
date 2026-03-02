"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { loginAction } from "@/app/actions/authActions";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    formData.append("redirectTo", "/account");
    const result = await loginAction(formData);

    if (result?.error) {
       setError(result.error);
       setLoading(false);
    }
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
      <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest text-center mb-2">Sign In</h1>
        <p className="text-center text-earth/70 text-sm mb-8">Enter your ritual space.</p>

        {error && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input type="email" name="email" placeholder="Email Address" required disabled={loading} />
            <Input type="password" name="password" placeholder="Password" required disabled={loading} />
          </div>

          <div className="flex justify-end">
             <Link href="/auth/forgot-password" className="text-xs text-earth/60 hover:text-bronze transition-colors">
               Forgot password?
             </Link>
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-earth/80">
          New to Originæ?{" "}
          <Link href="/auth/register" className="text-bronze hover:underline underline-offset-4">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
