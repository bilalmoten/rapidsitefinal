import { GeistSans } from "geist/font/sans";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";
import "prismjs/themes/prism-tomorrow.css";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { GoogleAnalytics } from "@next/third-parties/google";
import ClientTawkWrapper from "@/components/ClientTawkWrapper";
import { PostHogProvider } from "./providers";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "RapidSite | AI Website Builder",
  description:
    "RapidSite: The AI Website Builder that understands your website design needs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className={`${GeistSans.className} antialiased`}>
        <PostHogProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            // storageKey="rapidsite-theme"
            disableTransitionOnChange
          >
            <div className="min-h-screen bg-background">{children}</div>
            <Toaster richColors />
          </ThemeProvider>
          <Analytics />
          <SpeedInsights />
          <GoogleAnalytics gaId="G-6CS8ZP8T4K" />
          <ClientTawkWrapper />
        </PostHogProvider>
      </body>
    </html>
  );
}
