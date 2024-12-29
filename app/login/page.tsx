import LoginForm from "./LoginForm";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function LoginPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm message={params.message} />
    </Suspense>
  );
}
