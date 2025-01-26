"use client";

import { useEffect } from "react";

export default function TawkChat() {
  useEffect(() => {
    var Tawk_API = (window as any).Tawk_API || {};
    var Tawk_LoadStart = new Date();

    const s1 = document.createElement("script");
    const s0 = document.getElementsByTagName("script")[0];

    s1.async = true;
    s1.src = "https://embed.tawk.to/591b1e644ac4446b24a6f6a4/default";
    s1.charset = "UTF-8";
    s1.setAttribute("crossorigin", "*");

    s0.parentNode?.insertBefore(s1, s0);
  }, []);

  return null;
}
