"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/components/error-state";
import { ru } from "@/shared/i18n";

export default function BookDetailError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      console.error("[BookDetailError]", error);
    }
  }, [error]);

  return (
    <ErrorState
      title={ru.errors.bookLoadFailed}
      message={error.message}
      onRetry={reset}
    />
  );
}
