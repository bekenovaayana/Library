"use client";

import { useQuery } from "@tanstack/react-query";
import { adminApi } from "@/features/admin/api/adminApi";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import { useAuthStore } from "@/store/authStore";

export function useAdminStatistics() {
  const role = useAuthStore((state) => state.user?.role);

  return useQuery({
    queryKey: adminKeys.statistics(),
    queryFn: adminApi.getStatistics,
    enabled: role === "ADMIN",
    staleTime: 60 * 1000,
  });
}
