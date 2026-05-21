"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { adminApi } from "@/features/admin/api/adminApi";
import { adminKeys } from "@/features/admin/hooks/query-keys";
import type { UserRole } from "@/shared/types/auth";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { ru } from "@/shared/i18n";

export function useUpdateUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, role }: { userId: number; role: UserRole }) =>
      adminApi.updateUserRole(userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.all });
      toast.success(ru.admin.roleUpdated);
    },
    onError: (error) => toast.error(getApiErrorMessage(error)),
  });
}
