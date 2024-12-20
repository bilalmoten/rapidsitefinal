import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "../login/submit-button";

// Add password requirements
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
const PASSWORD_REQUIREMENTS =
  "Password must be at least 8 characters long and contain at least one letter and one number";

// Add this validation regex near the top with other constants
const EMAIL_REGEX = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;

export default async function Signup(props: {
  searchParams: Promise<{ message: string }>;
}) {
  const searchParams = await props.searchParams;
  const signUp = async (formData: FormData) => {
    "use server";

    const siteUrl = "https://aiwebsitebuilder.tech";
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    // Create a service role client for checking users
    // const supabaseAdmin = await createClient();
    const supabase = await createClient();

    console.log("Signup attempt with:", {
      email,
      redirectUrl: `${siteUrl}/auth/callback`,
    });

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${siteUrl}/auth/callback`,
        data: {
          redirect_url: `${siteUrl}/auth/callback`,
        },
      },
    });

    if (error) {
      console.error("Signup error:", error);
      return redirect(
        `/signup?message=${encodeURIComponent(
          error.message || "Sorry, we couldn't create your account"
        )}`
      );
    }

    return redirect("/signup?message=Check your email to verify your account");
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="w-full max-w-md space-y-8 p-10 bg-white rounded-xl shadow-lg">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
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
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                pattern={PASSWORD_REGEX.source}
                title={PASSWORD_REQUIREMENTS}
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
              <p className="mt-1 text-xs text-gray-500">
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
        {searchParams?.message && (
          <div
            className="mt-4 p-4 bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative"
            role="alert"
          >
            <p className="font-bold">Important:</p>
            <p className="block sm:inline">{searchParams.message}</p>
            {searchParams.message.includes("Check your email") && (
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
