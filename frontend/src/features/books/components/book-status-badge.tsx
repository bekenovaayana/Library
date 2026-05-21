import { cn } from "@/shared/lib/utils";
import type { BookStatus } from "@/features/books/types/book";
import { getAvailabilityLabel } from "@/features/books/types/book-detail";
import { bookStatusLabel } from "@/shared/i18n";

interface BookStatusBadgeProps {
  status: BookStatus;
  showAvailability?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const statusStyles: Record<BookStatus, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  BORROWED: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
};

const sizeStyles = {
  sm: "px-2 py-0.5 text-xs",
  md: "px-2.5 py-1 text-sm",
  lg: "px-3 py-1.5 text-base",
};

export function BookStatusBadge({
  status,
  showAvailability = false,
  size = "md",
  className,
}: BookStatusBadgeProps) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span
        className={cn(
          "inline-flex w-fit items-center rounded-full border font-medium",
          statusStyles[status],
          sizeStyles[size],
        )}
      >
        {bookStatusLabel(status)}
      </span>
      {showAvailability && (
        <span className="text-sm text-muted-foreground">{getAvailabilityLabel(status)}</span>
      )}
    </div>
  );
}
