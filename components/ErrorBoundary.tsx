"use client";

import { useEffect } from "react";
import { logger } from "../utils/logger";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error with our centralized logger
    logger.error("React Error Boundary caught an error", error, {
      component: "ErrorBoundary",
      digest: error.digest,
      path:
        typeof window !== "undefined" ? window.location.pathname : undefined,
    });
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h2 className="text-2xl font-bold mb-4">Something went wrong!</h2>
      <p className="text-gray-600 mb-6">
        We've logged this error and will work to fix it.
      </p>
      <button
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={() => {
          logger.track("error_boundary_reset");
          reset();
        }}
      >
        Try again
      </button>
    </div>
  );
}
