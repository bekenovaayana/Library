import { Card, CardContent } from "@/shared/ui/card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";

export default function BookDetailLoading() {
  return (
    <div className="space-y-6">
      <LoadingSkeleton className="h-10 w-40" />

      <Card>
        <CardContent className="space-y-6 p-6 sm:p-8">
          <div className="space-y-3">
            <LoadingSkeleton className="h-10 w-2/3" />
            <LoadingSkeleton className="h-8 w-32 rounded-full" />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <LoadingSkeleton key={index} className="h-20 w-full rounded-lg" />
            ))}
          </div>

          <LoadingSkeleton className="h-36 w-full rounded-lg" />
        </CardContent>
      </Card>
    </div>
  );
}
