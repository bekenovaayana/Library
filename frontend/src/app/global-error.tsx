"use client";

import { useEffect } from "react";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";
import { ru } from "@/shared/i18n";

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
    <html lang="ru">
      <body className="font-sans antialiased">
        <main className="flex min-h-screen items-center justify-center bg-white p-6 dark:bg-zinc-950">
          <div className="w-full max-w-lg">
            <FallbackUI
              kind="render"
              title={ru.errors.unexpectedCritical}
              message={error.message || ru.errors.unexpectedCritical}
              onRetry={reset}
              retryLabel={ru.errors.reloadApp}
            />
          </div>
        </main>
      </body>
    </html>
  );
}
