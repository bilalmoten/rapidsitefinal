import SignupForm from "./SignupForm";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function SignupPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
        <Suspense fallback={<div>Loading...</div>}>
          <SignupForm message={params.message} />
        </Suspense>
      </div>
    </div>
  );
}
