"use client";

import Link from "next/link";
import { SubmitButton } from "./submit-button";
import MotionWrapper from "@/components/MotionWrapper";
import AnimatedLoginContent from "@/components/AnimatedLoginContent";
import { FormMessage } from "@/components/form-message";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { signIn, signInWithGoogle } from "./actions";

export default function LoginForm({ message }: { message?: string }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <MotionWrapper className="flex h-screen">
      <div className="w-2/5 bg-gradient-to-br from-indigo-500 to-purple-600 text-white flex flex-col justify-center items-center p-12 relative overflow-hidden">
        <AnimatedLoginContent />
        <div className="absolute bottom-0 left-0 right-0">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#ffffff"
              fillOpacity="0.2"
              d="M0,96L48,112C96,128,192,160,288,186.7C384,213,480,235,576,213.3C672,192,768,128,864,128C960,128,1056,192,1152,208C1248,224,1344,192,1392,176L1440,160L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>
      <div className="w-3/5 flex items-center justify-center bg-background">
        <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
          <div className="text-center">
            <h2 className="mt-6 text-3xl font-bold text-neutral-10">
              Welcome back
            </h2>
            <p className="mt-2 text-sm text-neutral-30">
              Please sign in to your account
            </p>
          </div>

          {message && (
            <div
              className={`p-4 ${
                message.toLowerCase().includes("success")
                  ? "bg-green-100 border-green-400 text-green-700"
                  : "bg-red-100 border-red-400 text-red-700"
              } border rounded-md`}
              role="alert"
            >
              <p className="text-sm">{message}</p>
            </div>
          )}

          <form className="mt-8 space-y-6" action={signIn}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email" className="sr-only">
                  Email address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
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
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 pr-10 border border-neutral-70 placeholder-neutral-30 text-neutral-10 rounded-b-md focus:outline-none focus:ring-primary-main/20 focus:border-primary-main/50 focus:z-10 sm:text-sm bg-neutral-90/50"
                  placeholder="Password"
                />
                <div
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 h-full flex items-center px-3 text-neutral-30 hover:text-neutral-10 cursor-pointer"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-primary-main focus:ring-primary-main/20 border-neutral-70 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-neutral-10"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  href="/forgot-password"
                  className="font-medium text-primary-main hover:text-primary-main/80"
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <SubmitButton
                formAction={signIn}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-neutral-90 bg-primary-main hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20"
                pendingText="Signing in..."
              >
                Sign in
              </SubmitButton>
            </div>
          </form>
          <div className="text-center">
            <p className="mt-2 text-sm text-neutral-30">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="font-medium text-primary-main hover:text-primary-main/80"
              >
                Sign up
              </Link>
            </p>
          </div>
          <button
            onClick={async () => {
              await signInWithGoogle();
            }}
            type="button"
            className="w-full flex items-center justify-center gap-2 bg-neutral-90/50 text-neutral-10 border border-neutral-70 rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-90/80 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20"
          >
            <img src="/google.svg" alt="Google" className="w-5 h-5" />
            Sign in with Google
          </button>
        </div>
      </div>
    </MotionWrapper>
  );
}
