// components/Navbar.tsx
import Link from "next/link";
import AuthButton from "./AuthButton";

export default function Navbar() {
  return (
    <nav className="bg-gray-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-black text-lg font-bold">
          <Link href="/dashboard">AI Website Builder</Link>
        </div>
        <div className="space-x-4">{/* <AuthButton /> */}</div>
      </div>
    </nav>
  );
}
