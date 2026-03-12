"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { registerAction } from "@/app/actions/registerAction";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const result = await registerAction(null, formData);

    if (result.error) {
       setError(result.error);
       setLoading(false);
       return;
    }

    // Auto-login immediately after registration — no separate sign-in step
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const signInResult = await signIn("credentials", { redirect: false, email, password });

    if (signInResult?.error) {
       // Account created but auto-login failed — send to login with message
       window.location.href = "/auth/login?registered=true";
    } else {
       // Fully signed in — go straight to shop
       window.location.href = "/shop";
    }
  };

  const handleGoogle = () => {
    signIn("google", { callbackUrl: "/account" });
  };

  return (
    <div className="flex flex-col w-full min-h-screen bg-sand items-center justify-center py-24 px-6">
      <div className="bg-cream border border-earth/10 p-8 md:p-12 w-full max-w-md shadow-sm">
        <h1 className="text-3xl font-serif text-earth uppercase tracking-widest text-center mb-2">Create Account</h1>
        <p className="text-center text-earth/70 text-sm mb-8">Create your account. Shop immediately — no approval required.</p>

        {error && (
           <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 text-sm text-center">
             {error}
           </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Input type="text" name="firstName" placeholder="First Name" required disabled={loading} />
            <Input type="text" name="lastName" placeholder="Last Name" required disabled={loading} />
            <Input type="email" name="email" placeholder="Email Address" required disabled={loading} />
            <Input type="tel" name="phone" placeholder="Mobile Number (optional)" disabled={loading} />
            <Input type="password" name="password" placeholder="Password" required disabled={loading} />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
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
          Already have an account?{" "}
          <Link href="/auth/login" className="text-bronze hover:underline underline-offset-4">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
