"use client";

import { useCallback } from "react";
import { useUiStore } from "@/store/uiStore";

export function useGlobalLoading() {
  const setGlobalLoading = useUiStore((state) => state.setGlobalLoading);
  const isLoading = useUiStore((state) => state.globalLoading);

  const startLoading = useCallback(
    (message?: string) => setGlobalLoading(true, message),
    [setGlobalLoading],
  );

  const stopLoading = useCallback(() => setGlobalLoading(false), [setGlobalLoading]);

  const withLoading = useCallback(
    async <T>(fn: () => Promise<T>, message?: string): Promise<T> => {
      startLoading(message);
      try {
        return await fn();
      } finally {
        stopLoading();
      }
    },
    [startLoading, stopLoading],
  );

  return { isLoading, startLoading, stopLoading, withLoading };
}
