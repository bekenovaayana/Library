"use client";

import { AlertTriangle, RefreshCw, WifiOff } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import { ru } from "@/shared/i18n";
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
  offline: { icon: WifiOff, defaultTitle: ru.errors.offlinePage },
  network: { icon: WifiOff, defaultTitle: ru.errors.connectionProblem },
  timeout: { icon: AlertTriangle, defaultTitle: ru.errors.timeout },
  validation: { icon: AlertTriangle, defaultTitle: ru.errors.validation },
  unauthorized: { icon: AlertTriangle, defaultTitle: ru.errors.sessionExpired },
  forbidden: { icon: AlertTriangle, defaultTitle: ru.errors.forbidden },
  not_found: { icon: AlertTriangle, defaultTitle: ru.errors.notFound },
  conflict: { icon: AlertTriangle, defaultTitle: ru.errors.conflict },
  server: { icon: AlertTriangle, defaultTitle: ru.errors.serverError },
  unknown: { icon: AlertTriangle, defaultTitle: ru.errors.somethingWrong },
  render: { icon: AlertTriangle, defaultTitle: ru.errors.somethingWrong },
};

export function FallbackUI({
  title,
  message = ru.errors.unexpected,
  onRetry,
  retryLabel = ru.common.retry,
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
