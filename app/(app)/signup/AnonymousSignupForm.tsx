"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Eye, EyeOff } from "lucide-react";
import { convertAnonymousUser, signInWithGoogle } from "./actions";
import { SubmitButton } from "../login/submit-button";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

// Add password requirements
const PASSWORD_REGEX =
  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
const PASSWORD_REQUIREMENTS =
  "Password must be at least 8 characters long and contain at least one letter, one number, and one special character (@$!%*?&)";

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default function AnonymousSignupForm({
  message: initialMessage,
}: {
  message?: string;
}) {
  const [showPassword, setShowPassword] = useState(false);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const [message, setMessage] = useState<string | null>(initialMessage || null);
  const router = useRouter();

  useEffect(() => {
    async function checkAnonymousStatus() {
      try {
        // Check if user is anonymous
        const response = await fetch("/api/auth/anonymous", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          setIsAnonymous(data.isAnonymous);
        } else {
          console.error(
            "Error checking anonymous status:",
            await response.text()
          );
          toast.error("Could not verify anonymous status");
        }
      } catch (error) {
        console.error("Error checking anonymous status:", error);
        toast.error("Could not verify anonymous status");
      } finally {
        setIsLoading(false);
      }
    }

    // Get redirect path from session storage
    const storedRedirectPath = sessionStorage.getItem("redirectAfterAuth");
    if (storedRedirectPath) {
      setRedirectPath(storedRedirectPath);
      // Clear it after reading
      sessionStorage.removeItem("redirectAfterAuth");
    }

    // Set initial message if provided
    if (initialMessage) {
      setMessage(initialMessage);
    }

    checkAnonymousStatus();
  }, [initialMessage]);

  // Create a custom action that wraps the server action
  const formAction = async (formData: FormData) => {
    // Check if user is anonymous before proceeding
    if (!isAnonymous) {
      toast.error("You are not currently using an anonymous account");
      return;
    }

    // Add redirect path to form data if available
    if (redirectPath) {
      formData.append("redirectPath", redirectPath);
    }

    // Show loading state
    setIsLoading(true);

    try {
      // Call the server action and get the result
      const result = await convertAnonymousUser(formData);

      // Handle the response
      if (result.error) {
        // Show error message
        setMessage(result.error);
        toast.error(result.error);
        setIsSuccess(false);
      } else if (result.success) {
        // Show success message
        setMessage(
          result.message ||
            "Account created successfully! Check your email to verify."
        );
        setIsSuccess(true);
        toast.success("Account created successfully!");
      }
    } catch (error) {
      console.error("Error in form submission:", error);
      setMessage("An unexpected error occurred. Please try again.");
      toast.error("An unexpected error occurred");
      setIsSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="flex justify-center py-8">Loading...</div>;
  }

  if (!isAnonymous) {
    return (
      <div className="text-center py-8">
        <h2 className="text-xl font-bold mb-4">Not Anonymous</h2>
        <p className="mb-4">
          You are not currently using an anonymous account.
        </p>
        <Link
          href="/signup"
          className="font-medium text-primary-main hover:text-primary-main/80"
        >
          Sign up for a regular account
        </Link>
      </div>
    );
  }

  return (
    <>
      <div className="text-center">
        <h2 className="mt-6 text-3xl font-bold text-neutral-10">
          Create your account
        </h2>
        <p className="mt-2 text-sm text-neutral-30">
          Save your Express Mode website and unlock all features
        </p>
      </div>
      <form className="mt-8 space-y-6" action={formAction}>
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
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-neutral-90 bg-primary-main hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20"
            pendingText="Creating account..."
          >
            Save & Create Account
          </SubmitButton>
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-neutral-70"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-card text-neutral-30">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            {/* Create a separate hidden form for Google Sign-in */}
            <form
              action={async (formData: FormData) => {
                if (redirectPath) {
                  // Store the redirect path before going to Google auth
                  sessionStorage.setItem("redirectAfterAuth", redirectPath);
                }
                return signInWithGoogle();
              }}
            >
              <SubmitButton
                className="w-full inline-flex justify-center py-2 px-4 border border-neutral-70 rounded-md shadow-sm bg-white text-sm font-medium text-neutral-90 hover:bg-neutral-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20"
                pendingText="Connecting to Google..."
              >
                <svg
                  className="h-5 w-5 mr-2"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
                Sign up with Google
              </SubmitButton>
            </form>
          </div>
        </div>

        {/* Message display */}
        {message && (
          <div
            className={`mt-4 p-4 border px-4 py-3 rounded relative ${
              isSuccess
                ? "bg-green-100 border-green-400 text-green-700"
                : "bg-blue-100 border-blue-400 text-blue-700"
            }`}
            role="alert"
          >
            <p className="font-bold">{isSuccess ? "Success:" : "Important:"}</p>
            <p className="block sm:inline">{message}</p>
            {isSuccess && (
              <>
                <p className="mt-2">
                  Please check your email inbox and spam folder for a
                  verification link. You need to verify your email before you
                  can log in.
                </p>
                <p className="mt-2">
                  <strong>After verifying your email</strong>, you'll be
                  automatically redirected
                  {redirectPath && redirectPath.includes("/editor/") ? (
                    <>
                      {" "}
                      back to your website editor where you can continue
                      customizing your site.
                    </>
                  ) : (
                    <> to your dashboard.</>
                  )}
                </p>
                {redirectPath && (
                  <div className="mt-4">
                    <Link
                      href={redirectPath}
                      className="inline-block bg-primary-main text-white py-2 px-4 rounded hover:bg-primary-main/90"
                    >
                      Return to your website
                    </Link>
                    <p className="text-xs mt-1">
                      (Note: You'll need to verify your email first to make any
                      changes)
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </form>
    </>
  );
}
