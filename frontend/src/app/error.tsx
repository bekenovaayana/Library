"use client";

import { useEffect } from "react";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";
import { ru } from "@/shared/i18n";

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
          title={ru.errors.somethingWrong}
          message={error.message || ru.errors.unexpectedPage}
          onRetry={reset}
          retryLabel={ru.common.retry}
        />
      </div>
    </main>
  );
}
