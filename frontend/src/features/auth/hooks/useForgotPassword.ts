"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import type { ForgotPasswordFormValues } from "@/features/auth/schemas";
import { getApiErrorMessage } from "@/services/api/apiClient";

export function useForgotPassword() {
  return useMutation({
    mutationFn: (values: ForgotPasswordFormValues) => authApi.forgotPassword(values),
    onSuccess: (data) => {
      toast.success(data.message);
      if (data.resetToken) {
        toast.info("Dev mode: reset token copied to clipboard", { duration: 8000 });
        void navigator.clipboard?.writeText(data.resetToken);
      }
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
