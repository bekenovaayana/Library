"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { authApi } from "@/features/auth/api/authApi";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/store/authStore";

export function useLogout() {
  const router = useRouter();
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const refreshToken = useAuthStore((state) => state.refreshToken);

  const logout = async () => {
    try {
      await authApi.logout(refreshToken);
    } catch {
      // Best-effort revoke; always clear local session
    } finally {
      clearAuth();
      toast.success("You have been logged out");
      router.push(ROUTES.LOGIN);
      router.refresh();
    }
  };

  return { logout };
}
