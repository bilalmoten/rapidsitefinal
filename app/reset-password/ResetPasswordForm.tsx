"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface ResetPasswordFormProps {
  email?: string;
  token?: string;
}

export default function ResetPasswordForm({
  email,
  token,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleReset = async () => {
    setLoading(true);
    const supabase = createClient();

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (session) {
        // User is authenticated (from settings)
        const { error } = await supabase.auth.updateUser({
          password: password,
        });
        if (error) throw error;
      } else {
        // User is not authenticated (from email link)
        if (!email || !token) {
          throw new Error("Missing email or token");
        }

        // First verify the recovery token
        const { error: verifyError } = await supabase.auth.verifyOtp({
          email,
          token,
          type: "recovery",
        });
        if (verifyError) throw verifyError;

        // Then update the password
        const { error: updateError } = await supabase.auth.updateUser({
          password: password,
        });
        if (updateError) throw updateError;
      }

      toast.success("Password updated successfully");
      window.location.href = "/login";
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error(error.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="w-full max-w-md space-y-8 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Reset Your Password</h2>
          <p className="mt-2 text-muted-foreground">
            Enter your new password below
          </p>
        </div>
        <div className="space-y-4">
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button className="w-full" onClick={handleReset} disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </Button>
        </div>
      </div>
    </div>
  );
}
