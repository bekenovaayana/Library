"use client";

import { GlobalErrorBoundary } from "@/shared/ux/components/global-error-boundary";
import { AppLoader } from "@/shared/ux/components/app-loader";
import { OfflineBanner } from "@/shared/ux/components/offline-banner";

interface UxProviderProps {
  children: React.ReactNode;
}

export function UxProvider({ children }: UxProviderProps) {
  return (
    <GlobalErrorBoundary>
      <OfflineBanner />
      <AppLoader />
      {children}
    </GlobalErrorBoundary>
  );
}
