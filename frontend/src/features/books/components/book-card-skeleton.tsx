import { Card, CardContent, CardFooter, CardHeader } from "@/shared/ui/card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";

export function BookCardSkeleton() {
  return (
    <Card className="flex h-full flex-col overflow-hidden">
      <CardHeader className="space-y-3 pb-0">
        <div className="flex justify-between gap-3">
          <LoadingSkeleton className="h-5 w-3/4" />
          <LoadingSkeleton className="h-6 w-16 rounded-full" />
        </div>
        <LoadingSkeleton className="h-5 w-24 rounded-md" />
      </CardHeader>
      <CardContent className="flex-1 space-y-2.5 pb-4 pt-3">
        <LoadingSkeleton className="h-4 w-full" />
        <LoadingSkeleton className="h-3 w-20" />
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/20 p-3 sm:p-4">
        <LoadingSkeleton className="h-9 w-full rounded-md" />
        <LoadingSkeleton className="h-9 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
