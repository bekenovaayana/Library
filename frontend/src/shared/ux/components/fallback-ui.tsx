"use client";

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { ApiErrorKind } from "@/shared/ux/api/api-error-handler";

interface FallbackUIProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  kind?: ApiErrorKind | "render";
  className?: string;
}

const kindConfig: Record<
  ApiErrorKind | "render",
  { icon: typeof AlertTriangle; defaultTitle: string }
> = {
  offline: { icon: WifiOff, defaultTitle: "You are offline" },
  network: { icon: WifiOff, defaultTitle: "Connection problem" },
  timeout: { icon: AlertTriangle, defaultTitle: "Request timed out" },
  validation: { icon: AlertTriangle, defaultTitle: "Invalid request" },
  unauthorized: { icon: AlertTriangle, defaultTitle: "Session expired" },
  forbidden: { icon: AlertTriangle, defaultTitle: "Access denied" },
  not_found: { icon: AlertTriangle, defaultTitle: "Not found" },
  conflict: { icon: AlertTriangle, defaultTitle: "Conflict" },
  server: { icon: AlertTriangle, defaultTitle: "Server error" },
  unknown: { icon: AlertTriangle, defaultTitle: "Something went wrong" },
  render: { icon: AlertTriangle, defaultTitle: "Something went wrong" },
};

export function FallbackUI({
  title,
  message = "An unexpected error occurred. Please try again.",
  onRetry,
  retryLabel = "Try again",
  kind = "unknown",
  className,
}: FallbackUIProps) {
  const config = kindConfig[kind];
  const Icon = config.icon;
  const heading = title ?? config.defaultTitle;

  return (
    <section
      role="alert"
      aria-live="assertive"
      className={cn(
        "flex flex-col items-center justify-center rounded-lg border border-destructive/20 bg-destructive/5 p-8 text-center",
        "animate-in fade-in zoom-in-95 duration-300",
        className,
      )}
    >
      <Icon className="mb-4 h-10 w-10 text-destructive" aria-hidden />
      <h2 className="text-lg font-semibold">{heading}</h2>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button
          type="button"
          variant="outline"
          className="mt-6"
          onClick={onRetry}
          aria-label={retryLabel}
        >
          <RefreshCw className="mr-2 h-4 w-4" aria-hidden />
          {retryLabel}
        </Button>
      ) : null}
    </section>
  );
}
