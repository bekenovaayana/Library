"use client";

import { useEffect } from "react";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";

export default function MainError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[MainError]", error);
    }
  }, [error]);

  return (
    <div className="flex min-h-[50vh] items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <FallbackUI
          kind="render"
          title="Page error"
          message={error.message || "This page failed to load. Please try again."}
          onRetry={reset}
        />
      </div>
    </div>
  );
}
