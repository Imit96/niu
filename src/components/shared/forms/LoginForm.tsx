"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

export default function LoginForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
    <>
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
    </>
  );
}
