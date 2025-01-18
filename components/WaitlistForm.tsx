"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { toast } from "sonner";

export default function WaitlistForm() {
  const [loading, setLoading] = useState(false);
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const name = formData.get("name") as string;

    const { error } = await supabase
      .from("mailing_list")
      .insert([{ email, name }]);

    if (error) {
      if (error.code === "23505") {
        toast.error("You're already on the waitlist!");
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } else {
      toast.success("You've been added to the waitlist!");
      (e.target as HTMLFormElement).reset();
    }

    setLoading(false);
  };

  return (
    <div className="w-3/5 flex items-center justify-center">
      <div className="w-full max-w-md space-y-8 p-10 bg-neutral-90/50 rounded-xl border border-neutral-70">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-neutral-10">
            Join the Waitlist
          </h2>
          <p className="mt-2 text-sm text-neutral-30">
            Due to overwhelming response, we're currently accepting users on a
            waitlist basis. Sign up to secure your spot!
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-neutral-70 placeholder-neutral-30 text-neutral-10 rounded-md focus:outline-none focus:ring-primary-main/20 focus:border-primary-main/50 focus:z-10 sm:text-sm bg-neutral-90/50"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email" className="sr-only">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none relative block w-full px-3 py-2 border border-neutral-70 placeholder-neutral-30 text-neutral-10 rounded-md focus:outline-none focus:ring-primary-main/20 focus:border-primary-main/50 focus:z-10 sm:text-sm bg-neutral-90/50"
                placeholder="Email address"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-neutral-90 bg-primary-main hover:bg-primary-main/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-main/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Joining..." : "Join Waitlist"}
          </button>
        </form>
      </div>
    </div>
  );
}
