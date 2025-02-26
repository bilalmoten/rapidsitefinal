"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);

      if (error) throw error;

      toast.success("Reset instructions sent to your email");
      setEmail("");
    } catch (error: any) {
      console.error("Error sending reset email:", error);
      toast.error(error.message || "Failed to send reset instructions");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Left half - Decorative */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-indigo-500 to-purple-600 p-8 flex flex-col justify-center items-center text-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <h1 className="text-4xl font-bold mb-4">Forgot Password?</h1>
          <p className="text-xl mb-8">No worries, we'll help you reset it.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="w-64 h-64 relative"
        >
          <div className="absolute inset-0 bg-white opacity-20 rounded-full animate-pulse"></div>
          <div className="absolute inset-4 bg-white opacity-20 rounded-full animate-pulse animation-delay-500"></div>
          <div className="absolute inset-8 bg-white opacity-20 rounded-full animate-pulse animation-delay-1000"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <Mail className="w-24 h-24" />
          </div>
        </motion.div>
      </div>

      {/* Right half - Form */}
      <div className="w-full md:w-1/2 p-8 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-white">
            Reset Your Password
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Enter your email address and we'll send you instructions to reset
            your password.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <div className="relative">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>
            </div>
            <Button
              type="submit"
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={loading}
            >
              {loading ? "Sending..." : "Send Reset Instructions"}
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-gray-400">
            Remember your password?{" "}
            <Link href="/login" className="text-indigo-600 hover:underline">
              Back to Login
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
