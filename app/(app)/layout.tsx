import { GeistSans } from "geist/font/sans";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "prismjs/themes/prism-tomorrow.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import ClientTawkWrapper from "@/components/ClientTawkWrapper";
import { PostHogProvider } from "../providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "RapidSite | AI Website Builder",
  description:
    "RapidSite: The AI Website Builder that understands your website design needs.",
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={GeistSans.className}>
      <PostHogProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background antialiased">
            {children}
          </div>
          <Toaster richColors />
        </ThemeProvider>
        <Analytics />
        <SpeedInsights />
        <GoogleAnalytics gaId="G-6CS8ZP8T4K" />
        <ClientTawkWrapper />
      </PostHogProvider>
    </div>
  );
}
