import { Loader2 } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface FullPageLoaderProps {
  message?: string;
  className?: string;
}

export function FullPageLoader({
  message = "Loading...",
  className,
}: FullPageLoaderProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-busy="true"
      className={cn(
        "flex min-h-screen flex-col items-center justify-center gap-4 bg-background",
        "animate-in fade-in duration-300",
        className,
      )}
    >
      <Loader2 className="h-10 w-10 animate-spin text-primary" aria-hidden />
      <p className="text-sm text-muted-foreground">{message}</p>
      <span className="sr-only">{message}</span>
    </div>
  );
}
