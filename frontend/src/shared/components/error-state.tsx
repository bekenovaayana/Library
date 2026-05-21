import { ru } from "@/shared/i18n";
import { APIErrorHandler } from "@/shared/ux/api/api-error-handler";
import { FallbackUI } from "@/shared/ux/components/fallback-ui";

interface ErrorStateProps {
  title?: string;
  message?: string;
  error?: unknown;
  onRetry?: () => void;
  retryLabel?: string;
  className?: string;
}

export function ErrorState({
  title,
  message,
  error,
  onRetry,
  retryLabel = ru.common.retry,
  className,
}: ErrorStateProps) {
  const parsed = error ? APIErrorHandler.parse(error) : null;

  return (
    <FallbackUI
      title={title}
      message={message ?? parsed?.message ?? ru.errors.unexpected}
      kind={parsed?.kind ?? "unknown"}
      onRetry={onRetry}
      retryLabel={retryLabel}
      className={className}
    />
  );
}
