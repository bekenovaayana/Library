"use client";

import { useQuery } from "@tanstack/react-query";
import { libraryApi } from "@/features/library/api/libraryApi";

export const LIBRARY_POLICY_KEY = ["library", "policy"] as const;

export const DEFAULT_LIBRARY_POLICY = {
  borrowDays: 14,
  finePerDay: 1,
  maxFine: 50,
};

export function useLibraryPolicy() {
  return useQuery({
    queryKey: LIBRARY_POLICY_KEY,
    queryFn: async () => {
      try {
        return await libraryApi.getPolicy();
      } catch {
        return DEFAULT_LIBRARY_POLICY;
      }
    },
    staleTime: 5 * 60 * 1000,
    placeholderData: DEFAULT_LIBRARY_POLICY,
    retry: false,
    meta: { silent: true },
  });
}

export function buildEstimatedDueDate(borrowDays: number): string {
  const due = new Date();
  due.setDate(due.getDate() + borrowDays);
  return due.toISOString();
}
