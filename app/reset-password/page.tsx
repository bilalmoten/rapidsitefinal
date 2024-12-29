"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/update-password`,
      });

      if (error) throw error;

      toast.success("Check your email for the password reset link");
      setEmail("");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to send reset password email");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      <div className="w-2/5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-12">
        <h1 className="text-4xl font-bold mb-4">Reset Password</h1>
        <p className="text-xl text-center">
          Don't worry! It happens to the best of us.
        </p>
      </div>

      <div className="w-3/5 flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Forgot your password?</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Enter your email address below and we'll send you a link to reset
              your password.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-6">
            <div>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Sending..." : "Send Reset Link"}
            </Button>

            <div className="text-center">
              <Link
                href="/login"
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                Back to login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
