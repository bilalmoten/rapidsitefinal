"use client";

import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";
import Link from "next/link";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ subdomain: string }>;
}

interface WebsiteWithUsage {
  user: {
    user_usage: {
      plan: string;
    };
  };
}

export default function SubdomainLayout({ children, params }: LayoutProps) {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    async function checkPlan() {
      const resolvedParams = await params;
      const supabase = createClient();
      const { data: website } = (await supabase
        .from("websites")
        .select(
          `
          user_id,
          user:user_id (
            user_usage (
              plan
            )
          )
        `
        )
        .eq("subdomain", resolvedParams.subdomain)
        .single()) as { data: WebsiteWithUsage | null };

      setShowBanner(website?.user?.user_usage?.plan === "free");
    }

    checkPlan();
  }, [params]);

  return (
    <>
      {children}
      {showBanner && (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-3 px-4 shadow-lg">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <p className="text-sm">
              Built with{" "}
              <Link
                href="https://rapidai.website"
                className="font-semibold hover:text-indigo-200"
              >
                AI Website Builder
              </Link>{" "}
              - Create your own AI-powered website in minutes!
            </p>
            <Link
              href="https://rapidai.website/signup"
              className="bg-white text-indigo-600 px-4 py-1.5 rounded-full text-sm font-semibold hover:bg-indigo-50 transition-colors"
            >
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
