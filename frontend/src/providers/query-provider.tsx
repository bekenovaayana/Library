"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { APIErrorHandler } from "@/shared/ux/api/api-error-handler";

function shouldRetryQuery(failureCount: number, error: unknown): boolean {
  const parsed = APIErrorHandler.parse(error);
  if (
    parsed.kind === "offline" ||
    parsed.kind === "unauthorized" ||
    parsed.kind === "forbidden" ||
    parsed.kind === "server" ||
    parsed.kind === "conflict" ||
    parsed.kind === "not_found" ||
    (parsed.status !== undefined && parsed.status >= 500)
  ) {
    return false;
  }
  return failureCount < 1;
}

function handleQueryError(error: unknown, query: { meta?: unknown }) {
  const meta = query.meta as { silent?: boolean } | undefined;
  if (meta?.silent) return;

  const parsed = APIErrorHandler.parse(error);
  if (parsed.kind === "unauthorized") return;

  if (APIErrorHandler.shouldShowGlobalToast(parsed)) {
    APIErrorHandler.handle(error, { toast: true });
  }
}

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            retry: shouldRetryQuery,
            refetchOnWindowFocus: false,
            refetchOnReconnect: true,
          },
          mutations: {
            retry: false,
          },
        },
      }),
  );

  queryClient.getQueryCache().config.onError = (error, query) => {
    handleQueryError(error, query);
  };

  queryClient.getMutationCache().config.onError = () => {
    // Mutations handle their own toasts in feature hooks
  };

  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}