"use client";

import { Loader2 } from "lucide-react";
import { useMounted } from "@/shared/hooks/use-mounted";
import { useUiStore } from "@/store/uiStore";
import { cn } from "@/shared/lib/utils";
import { ru } from "@/shared/i18n";

export function AppLoader() {
  const mounted = useMounted();
  const globalLoading = useUiStore((state) => state.globalLoading);
  const message = useUiStore((state) => state.globalLoadingMessage);

  if (!mounted || !globalLoading) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm",
        "animate-in fade-in duration-200",
      )}
    >
      <div className="flex flex-col items-center gap-3 rounded-lg border bg-card p-6 shadow-lg">
        <Loader2 className="h-8 w-8 animate-spin text-primary" aria-hidden />
        <p className="text-sm font-medium text-foreground">
          {message ?? ru.common.pleaseWait}
        </p>
        <span className="sr-only">{message ?? ru.common.loading}</span>
      </div>
    </div>
  );
}
