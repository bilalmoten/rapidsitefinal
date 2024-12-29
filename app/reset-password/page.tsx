import ResetPasswordForm from "./ResetPasswordForm";
import { Suspense } from "react";

interface PageProps {
  searchParams: {
    email?: string;
    token?: string;
  };
}

export default function ResetPasswordPage({ searchParams }: PageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordForm
        email={searchParams.email}
        token={searchParams.token}
      />
    </Suspense>
  );
}
