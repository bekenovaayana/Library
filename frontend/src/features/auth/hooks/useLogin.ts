"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import type { LoginFormValues } from "@/features/auth/schemas";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { useAuthStore } from "@/store/authStore";

export function useLogin() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (values: LoginFormValues) => authApi.login(values),
    onSuccess: (data) => {
      setAuth({ username: data.username, role: data.role }, data.token, data.refreshToken);
      toast.success(`Welcome back, ${data.username}!`);

      const redirect = searchParams.get("redirect");
      const destination =
        redirect && redirect.startsWith("/") && !redirect.startsWith("//")
          ? redirect
          : ROUTES.DASHBOARD;

      router.push(destination);
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
