"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import type { RegisterFormValues } from "@/features/auth/schemas";
import { ROUTES } from "@/shared/constants/routes";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { useAuthStore } from "@/store/authStore";
import { ru } from "@/shared/i18n";

export function useRegister() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (values: RegisterFormValues) => authApi.register(values),
    onSuccess: (data) => {
      setAuth({ username: data.username, role: data.role }, data.token, data.refreshToken);
      toast.success(ru.auth.accountCreated);
      const home = data.role === "ADMIN" ? ROUTES.ADMIN : ROUTES.DASHBOARD;
      router.push(home);
      router.refresh();
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}
