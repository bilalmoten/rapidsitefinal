"use client";

import dynamic from "next/dynamic";

const TawkChat = dynamic(() => import("./TawkChat"), {
  ssr: false,
});

export default function ClientTawkWrapper() {
  return <TawkChat />;
}
