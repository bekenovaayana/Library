"use client";

import { MainLayout } from "@/shared/components/layouts/main-layout";
import { ProtectedRoute } from "@/shared/components/auth/protected-route";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export function ProtectedLayout({ children }: ProtectedLayoutProps) {
  return (
    <ProtectedRoute>
      <MainLayout>{children}</MainLayout>
    </ProtectedRoute>
  );
}
