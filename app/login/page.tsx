import LoginForm from "./LoginForm";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return <LoginForm message={searchParams.message} />;
}
