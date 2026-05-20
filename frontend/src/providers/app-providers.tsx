"use client";

import { AuthHydration } from "@/features/auth/components/auth-hydration";
import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";
import { ToastProvider } from "./toast-provider";
import { UxProvider } from "./ux-provider";
import { PwaProvider } from "./pwa-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <UxProvider>
          <PwaProvider>
            <AuthHydration>
              {children}
              <ToastProvider />
            </AuthHydration>
          </PwaProvider>
        </UxProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}