"use client";

import { useEffect } from "react";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[AppError]", error);
    }
  }, [error]);

  return (
    <main className="flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <FallbackUI
          kind="render"
          title="Something went wrong"
          message={error.message || "An unexpected error occurred while loading this page."}
          onRetry={reset}
          retryLabel="Try again"
        />
      </div>
    </main>
  );
}
