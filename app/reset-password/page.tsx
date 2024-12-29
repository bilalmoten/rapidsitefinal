import ResetPasswordForm from "./ResetPasswordForm";
import { Suspense } from "react";

interface PageProps {
  searchParams: Promise<{
    email?: string;
    token?: string;
  }>;
}

export default async function ResetPasswordPage({ searchParams }: PageProps) {
  const params = await searchParams;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm email={params.email} token={params.token} />
    </Suspense>
  );
}
