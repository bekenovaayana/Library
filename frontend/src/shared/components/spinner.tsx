import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ru } from "@/shared/i18n";

interface SpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-8 w-8",
};

export function Spinner({ className, size = "md" }: SpinnerProps) {
  return (
    <span role="status" className="inline-flex" aria-label={ru.common.loading}>
      <Loader2
        className={cn("animate-spin text-muted-foreground motion-reduce:animate-none", sizeClasses[size], className)}
        aria-hidden
      />
      <span className="sr-only">{ru.common.loading}</span>
    </span>
  );
}
