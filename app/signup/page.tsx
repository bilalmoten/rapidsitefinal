import SignupForm from "./SignupForm";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: { message?: string };
}) {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-background">
      <div className="w-full max-w-md space-y-8 p-10 bg-card rounded-xl shadow-lg">
        <SignupForm message={searchParams.message} />
      </div>
    </div>
  );
}
