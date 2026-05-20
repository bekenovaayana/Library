"use client";

import { useEffect } from "react";
import { registerServiceWorker } from "@/pwa/register-service-worker";
import { env } from "@/shared/config/env";

export function PwaProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (!env.pwaEnabled) return;
    void registerServiceWorker();
  }, []);

  return <>{children}</>;
}
