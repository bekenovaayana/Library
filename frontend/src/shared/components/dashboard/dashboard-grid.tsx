import { cn } from "@/shared/lib/utils";

interface DashboardGridProps {
  children: React.ReactNode;
  className?: string;
  columns?: "stats" | "charts" | "auto";
}

const columnClasses: Record<NonNullable<DashboardGridProps["columns"]>, string> = {
  stats: "grid-cols-1 sm:grid-cols-2 xl:grid-cols-4",
  charts: "grid-cols-1 lg:grid-cols-2",
  auto: "grid-cols-1 md:grid-cols-2",
};

export function DashboardGrid({ children, className, columns = "auto" }: DashboardGridProps) {
  return (
    <div className={cn("grid gap-4 md:gap-6", columnClasses[columns], className)}>{children}</div>
  );
}
