"use client";

import { RefreshCw, WifiOff } from "lucide-react";
import { useOnlineStatus } from "@/shared/ux/hooks/use-online-status";
import { useMounted } from "@/shared/hooks/use-mounted";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";

interface OfflineBannerProps {
  onRetry?: () => void;
  className?: string;
}

export function OfflineBanner({ onRetry, className }: OfflineBannerProps) {
  const mounted = useMounted();
  const isOnline = useOnlineStatus();

  if (!mounted || isOnline) return null;

  const handleRetry = () => {
    window.location.reload();
    onRetry?.();
  };

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        "fixed inset-x-0 top-0 z-[90] flex items-center justify-center gap-3 border-b border-amber-500/30 bg-amber-500/10 px-4 py-2 text-sm",
        "animate-in slide-in-from-top duration-300",
        className,
      )}
    >
      <WifiOff className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400" aria-hidden />
      <p className="text-amber-900 dark:text-amber-200">
        You are offline. Some features may be unavailable.
      </p>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleRetry}
        className="h-7 shrink-0 border-amber-500/40"
        aria-label="Retry connection"
      >
        <RefreshCw className="mr-1 h-3 w-3" aria-hidden />
        Retry
      </Button>
    </div>
  );
}
