"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import { ROUTES } from "@/shared/constants/routes";
import { FullPageLoader } from "@/shared/ux/components/full-page-loader";
import { ru } from "@/shared/i18n";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const hasHydrated = useAuthHydration();
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (hasHydrated && !isAuthenticated) {
      const loginUrl = `${ROUTES.LOGIN}?redirect=${encodeURIComponent(pathname)}`;
      router.replace(loginUrl);
    }
  }, [hasHydrated, isAuthenticated, pathname, router]);

  if (!hasHydrated || !isAuthenticated) {
    return <FullPageLoader message={ru.errors.checkingAuth} />;
  }

  return <>{children}</>;
}
