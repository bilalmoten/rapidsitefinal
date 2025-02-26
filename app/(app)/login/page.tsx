import LoginForm from "./LoginForm";
import { Suspense } from "react";

export default async function LoginPage(props: {
  params: Promise<{}>;
  searchParams: Promise<{ message?: string }>;
}) {
  const searchParams = await props.searchParams;
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginForm message={searchParams.message} />
    </Suspense>
  );
}
