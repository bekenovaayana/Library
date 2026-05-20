"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import type { ResetPasswordFormValues } from "@/features/auth/schemas";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/services/api/apiClient";

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: (values: ResetPasswordFormValues) => authApi.resetPassword(values),
    onSuccess: (data) => {
      toast.success(data.message);
      router.push(ROUTES.LOGIN);
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
