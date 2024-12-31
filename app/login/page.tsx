import LoginForm from "./LoginForm";
import { Suspense } from "react";

interface PageProps {
  searchParams: { message?: string };
}

export default function LoginPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm message={searchParams.message} />
    </Suspense>
  );
}
