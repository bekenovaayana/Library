import { Card, CardContent, CardHeader } from "@/shared/ui/card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { cn } from "@/shared/lib/utils";

interface StatsCardSkeletonProps {
  className?: string;
}

export function StatsCardSkeleton({ className }: StatsCardSkeletonProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <LoadingSkeleton className="h-4 w-24" />
        <LoadingSkeleton className="h-9 w-9 rounded-lg" />
      </CardHeader>
      <CardContent className="space-y-2">
        <LoadingSkeleton className="h-9 w-20" />
        <LoadingSkeleton className="h-3 w-32" />
      </CardContent>
    </Card>
  );
}
