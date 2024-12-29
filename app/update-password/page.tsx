import { Suspense } from "react";
import UpdatePasswordForm from "./UpdatePasswordForm";

interface PageProps {
  searchParams: Promise<any>;
}

export default async function UpdatePasswordPage({ searchParams }: PageProps) {
  await searchParams; // Wait for searchParams to resolve

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UpdatePasswordForm />
    </Suspense>
  );
}
