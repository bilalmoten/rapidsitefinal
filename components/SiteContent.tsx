"use client";

import Script from "next/script";
import React, { useEffect } from "react";

interface SiteContentProps {
  content: string;
}

export default function SiteContent({ content }: SiteContentProps) {
  useEffect(() => {
    // Initialize Alpine.js when the component mounts
    if (window.Alpine) {
      window.Alpine.start();
    }
  }, []);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/js/all.min.js"
        strategy="beforeInteractive"
      />
      <Script src="https://cdn.tailwindcss.com" strategy="afterInteractive" />
      <link
        href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css"
        rel="stylesheet"
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
        src="https://cdnjs.cloudflare.com/ajax/libs/alpinejs/2.3.0/alpine-ie11.js"
        strategy="afterInteractive"
        onReady={() => {
          if (window.Alpine) {
            window.Alpine.start();
          }
        }}
      />
      <div
        dangerouslySetInnerHTML={{ __html: content }}
        suppressHydrationWarning
      />
    </>
  );
}
