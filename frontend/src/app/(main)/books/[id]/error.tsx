"use client";

import { useEffect } from "react";
import { ErrorState } from "@/shared/components/error-state";

interface BookDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BookDetailError({ error, reset }: BookDetailErrorProps) {
  useEffect(() => {
    console.error("Book detail page error:", error);
  }, [error]);

  return (
    <ErrorState
      title="Failed to load book"
      message={error.message || "Something went wrong while loading this book."}
      onRetry={reset}
    />
  );
}
