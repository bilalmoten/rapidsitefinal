"use client";

import Script from "next/script";
import React, { useEffect } from "react";

interface SiteContentProps {
  content: string;
  headContent?: string;
}

export default function SiteContent({
  content,
  headContent,
}: SiteContentProps) {
  useEffect(() => {
    // Initialize Alpine.js only if it hasn't been initialized
    if (
      typeof window !== "undefined" &&
      window.Alpine &&
      !window.Alpine.initialized
    ) {
      window.Alpine.start();
      window.Alpine.initialized = true;
    }
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"
        strategy="beforeInteractive"
      />
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css"
        rel="stylesheet"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdn.jsdelivr.net/npm/framer-motion@11.15.0/dist/framer-motion.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/particlesjs/2.2.3/particles.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/Swiper/11.0.5/swiper-bundle.min.js"
        strategy="afterInteractive"
      />
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/3.13.5/cdn.min.js"
        strategy="afterInteractive"
        id="alpine-js"
      />
      <Script src="https://cdn.tailwindcss.com" strategy="beforeInteractive" />

      {headContent && (
        <div
          dangerouslySetInnerHTML={{ __html: headContent }}
          suppressHydrationWarning
        />
      )}
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        suppressHydrationWarning
      />
    </>
  );
}

declare global {
  interface Window {
    Alpine: any;
  }
}
