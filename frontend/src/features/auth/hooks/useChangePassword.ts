"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import type { ChangePasswordFormValues } from "@/features/auth/schemas";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { useAuthStore } from "@/store/authStore";

export function useChangePassword() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);

  return useMutation({
    mutationFn: (values: ChangePasswordFormValues) =>
      authApi.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }),
    onSuccess: (data) => {
      clearAuth();
      toast.success(data.message);
      router.push(ROUTES.LOGIN);
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
