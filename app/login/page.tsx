import Link from "next/link";
import { headers } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import Image from "next/image";
import { Lock } from "lucide-react";
import MotionWrapper from "@/components/MotionWrapper";
import AnimatedLoginContent from "@/components/AnimatedLoginContent";

interface LoginPageProps {
  searchParams: Promise<{ message: string }>;
}

export default async function Login({ searchParams }: LoginPageProps) {
  const params = await searchParams;

  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect("/dashboard");
  };

  return (
    <MotionWrapper className="flex min-h-screen flex-col items-center justify-center py-2">
      <AnimatedLoginContent searchParams={params} />
    </MotionWrapper>
  );
}
