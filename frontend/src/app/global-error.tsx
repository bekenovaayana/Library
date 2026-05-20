"use client";

import { useEffect } from "react";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[GlobalError]", error);
    }
  }, [error]);

  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <main className="flex min-h-screen items-center justify-center bg-white p-6 dark:bg-zinc-950">
          <div className="w-full max-w-lg">
            <FallbackUI
              kind="render"
              title="Application error"
              message={error.message || "A critical error occurred. Please reload the application."}
              onRetry={reset}
              retryLabel="Reload application"
            />
          </div>
        </main>
      </body>
    </html>
  );
}
