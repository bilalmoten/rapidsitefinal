import { Mail } from "lucide-react";

export default function NewsletterPage() {
  return (
    <div className="border border-neutral-70 rounded-lg bg-[#0a0a0b00] backdrop-blur-sm">
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 bg-primary-main bg-opacity-10 rounded-lg flex items-center justify-center mb-4">
          <Mail className="w-8 h-8 text-primary-main" />
        </div>
        <h2 className="text-[28px] font-medium text-white mb-2">
          Newsletter Coming Soon
        </h2>
        <p className="text-neutral-40 text-sm max-w-md">
          We're working on bringing you powerful newsletter management features.
          Stay tuned for updates!
        </p>
      </div>
    </div>
  );
}
