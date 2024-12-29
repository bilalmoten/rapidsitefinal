"use client";
import Link from "next/link";
import { SubmitButton } from "../login/submit-button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signUp } from "./actions";
import { useSearchParams } from "next/navigation";

// Add password requirements
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_REQUIREMENTS =
  "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*?&)";

// Add this validation regex near the top with other constants
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const message = searchParams?.get("message");

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-foreground">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-medium text-indigo-600 hover:text-indigo-500"
            >
              Sign in
            </Link>
          </p>
        </div>
        <form className="mt-8 space-y-6" action={signUp}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                pattern={EMAIL_REGEX.source}
                title="Please enter a valid email address"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-input placeholder-muted-foreground text-foreground rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-background"
                placeholder="Email address"
              />
            </div>
            <div className="relative">
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                pattern={PASSWORD_REGEX.source}
                title={PASSWORD_REQUIREMENTS}
                className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-input placeholder-muted-foreground text-foreground rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm bg-background"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute top-0 right-0 h-[38px] w-[38px] flex items-center justify-center"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
              <p className="mt-1 text-xs text-muted-foreground">
                {PASSWORD_REQUIREMENTS}
              </p>
            </div>
          </div>

          <div>
            <SubmitButton
              formAction={signUp}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              pendingText="Creating account..."
            >
              Sign up
            </SubmitButton>
          </div>
        </form>
        {message && (
          <div
            className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <p className="font-bold">Important:</p>
            <p className="block sm:inline">{message}</p>
            {message.includes("Check your email") && (
              <p className="mt-2">
                Please check your email inbox and spam folder for a verification
                link. You need to verify your email before you can log in.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
