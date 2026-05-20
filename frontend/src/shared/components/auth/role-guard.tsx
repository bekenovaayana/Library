"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { showErrorToast } from "@/shared/ux/toast/toast";
import { useAuthStore } from "@/store/authStore";
import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import type { UserRole } from "@/shared/types/auth";
import { ROUTES } from "@/shared/constants/routes";
import { Spinner } from "@/shared/components/spinner";
import { ErrorState } from "@/shared/components/error-state";

interface RoleGuardProps {
  roles: UserRole[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function RoleGuard({ roles, children, fallback }: RoleGuardProps) {
  const router = useRouter();
  const hasHydrated = useAuthHydration();
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  const hasAccess = user ? roles.includes(user.role) : false;

  useEffect(() => {
    if (hasHydrated && isAuthenticated && user && !hasAccess) {
      showErrorToast("You do not have permission to access this page");
      router.replace(ROUTES.DASHBOARD);
    }
  }, [hasHydrated, isAuthenticated, user, hasAccess, router]);

  if (!hasHydrated) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!hasAccess) {
    return (
      fallback ?? (
        <ErrorState
          title="Access denied"
          message="You do not have the required permissions to view this content."
        />
      )
    );
  }

  return <>{children}</>;
}
