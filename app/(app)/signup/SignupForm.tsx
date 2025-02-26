"use client";

import Link from "next/link";
import { SubmitButton } from "../login/submit-button";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signUp, signInWithGoogle } from "./actions";

// Add password requirements
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_REQUIREMENTS =
  "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*?&)";

// Add this validation regex near the top with other constants
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function SignupForm({ message }: { message?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-neutral-10">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-neutral-30">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary-main hover:text-primary-main/80"
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 border border-neutral-70 placeholder-neutral-30 text-neutral-10 rounded-t-md focus:outline-none focus:ring-primary-main/20 focus:border-primary-main/50 focus:z-10 sm:text-sm bg-neutral-90/50"
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
              className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-neutral-70 placeholder-neutral-30 text-neutral-10 rounded-b-md focus:outline-none focus:ring-primary-main/20 focus:border-primary-main/50 focus:z-10 sm:text-sm bg-neutral-90/50"
              placeholder="Password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute top-0 right-0 h-[38px] w-[38px] flex items-center justify-center
               text-neutral-30 hover:text-neutral-10"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
            <p className="mt-1 text-xs text-neutral-30">
              {PASSWORD_REQUIREMENTS}
            </p>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="newsletter"
              name="newsletter"
              type="checkbox"
              defaultChecked={true}
              className="h-4 w-4 text-primary-main border-neutral-70 rounded bg-neutral-90/50 focus:ring-primary-main/20"
            />
          </div>
          <div className="ml-3">
            <label htmlFor="newsletter" className="text-sm text-neutral-30">
              Subscribe to our newsletter for updates and new features
            </label>
          </div>
        </div>

        <div>
          <SubmitButton
            formAction={signUp}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-neutral-90 bg-primary-main hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20"
            pendingText="Creating account..."
          >
            Sign up
          </SubmitButton>
        </div>
      </form>
      <div className="relative my-4">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-neutral-70"></div>
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-neutral-90/50 px-2 text-neutral-30">
            Or continue with
          </span>
        </div>
      </div>
      <button
        onClick={async () => {
          const formData = new FormData();
          const newsletterCheckbox = document.getElementById(
            "newsletter"
          ) as HTMLInputElement;
          if (newsletterCheckbox?.checked) {
            formData.append("newsletter", "on");
          }
          await signInWithGoogle(formData);
        }}
        type="button"
        className="w-full flex items-center justify-center gap-2 bg-neutral-90/50 text-neutral-10 border border-neutral-70 rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-90/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20"
      >
        <img src="/google.svg" alt="Google" className="w-5 h-5" />
        Sign up with Google
      </button>
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
    </>
  );
}
