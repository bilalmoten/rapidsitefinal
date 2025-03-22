"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AnonymousUserBanner() {
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function checkAnonymousStatus() {
      try {
        // Call the server API to check anonymous status
        const response = await fetch("/api/auth/anonymous", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Important for cookies
        });

        if (!response.ok) {
          console.error(
            "Error checking anonymous status:",
            await response.text()
          );
          return;
        }

        const data = await response.json();
        console.log("Anonymous status check:", data);
        setIsAnonymous(data.isAnonymous);
      } catch (error) {
        console.error("Error checking anonymous status:", error);
      } finally {
        setIsLoading(false);
      }
    }

    checkAnonymousStatus();
  }, []);

  const handleSignUp = () => {
    // Store the current URL in session storage to redirect back after sign-up
    sessionStorage.setItem("redirectAfterAuth", window.location.pathname);
    router.push("/signup?anonymous=true");
  };

  const handleLogin = () => {
    // Store the current URL in session storage to redirect back after login
    sessionStorage.setItem("redirectAfterAuth", window.location.pathname);
    router.push("/login?anonymous=true");
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  if (isLoading || !isAnonymous || !isVisible) {
    return null;
  }

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-violet-700 p-3 text-white shadow-lg">
      <div className="container max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between">
        <div className="flex-1 text-center sm:text-left mb-3 sm:mb-0">
          <p className="font-medium">
            You're in Express Mode! Sign up to save your website and unlock all
            features.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="bg-white/10 text-white border-white/20 hover:bg-white/20"
            onClick={handleLogin}
          >
            Login
          </Button>
          <Button
            className="bg-white text-blue-700 hover:bg-white/90"
            onClick={handleSignUp}
          >
            Sign Up Free
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-white/10"
            onClick={handleClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
