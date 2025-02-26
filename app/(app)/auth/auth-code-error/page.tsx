import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AuthCodeErrorPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md w-full space-y-8 p-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground">
            Authentication Error
          </h1>
          <p className="mt-2 text-muted-foreground">
            The authentication code is invalid or has expired.
          </p>
        </div>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">This could happen if:</p>
          <ul className="list-disc list-inside text-sm text-muted-foreground space-y-2">
            <li>The link in your email has expired</li>
            <li>You've already used this link</li>
            <li>The link was modified or incomplete</li>
          </ul>
          <div className="pt-4">
            <Link href="/forgot-password">
              <Button className="w-full">Request New Reset Link</Button>
            </Link>
            <p className="mt-4 text-center text-sm text-muted-foreground">
              Or go back to{" "}
              <Link href="/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
