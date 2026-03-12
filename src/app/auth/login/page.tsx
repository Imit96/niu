"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const searchParams = useSearchParams();
  const registered = searchParams.get("registered") === "true";
  const reset = searchParams.get("reset") === "success";

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
       setError("Invalid credentials. Please try again.");
       setLoading(false);
    } else {
       // login successful! Force hard navigation to ensure full context hydration
       window.location.href = "/account";
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/account" });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
      <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest text-center mb-2">Sign In</h1>
        <p className="text-center text-earth/70 text-sm mb-8">Welcome back.</p>

        {registered && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center">
            Account created. Sign in to continue shopping.
          </div>
        )}

        {reset && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 text-sm text-center">
            Password updated. You can now sign in.
          </div>
        )}

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

        <div className="relative my-8">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-earth/20" />
          </div>
          <div className="relative flex justify-center text-xs uppercase tracking-widest">
            <span className="bg-cream px-4 text-earth/50">Or continue with</span>
          </div>
        </div>

        <Button type="button" onClick={handleGoogle} className="w-full bg-white text-earth border border-earth/20 hover:bg-earth/5 transition-colors shadow-sm">
          <svg className="w-4 h-4 mr-3" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path></svg>
          Google
        </Button>

        <div className="mt-8 text-center text-sm text-earth/80">
          New to ORIGONÆ?{" "}
          <Link href="/auth/register" className="text-bronze hover:underline underline-offset-4">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
