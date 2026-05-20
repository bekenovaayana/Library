"use client";

import { useAuthHydration } from "@/features/auth/hooks/useAuthHydration";
import { FullPageLoader } from "@/shared/ux/components/full-page-loader";
import { useMounted } from "@/shared/hooks/use-mounted";

interface AuthHydrationProps {
  children: React.ReactNode;
}

export function AuthHydration({ children }: AuthHydrationProps) {
  const mounted = useMounted();
  const hasHydrated = useAuthHydration();

  if (!mounted || !hasHydrated) {
    return <FullPageLoader message="Preparing your session..." />;
  }

  return <>{children}</>;
}
