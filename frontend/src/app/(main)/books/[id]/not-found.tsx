import Link from "next/link";
import { BookX } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/empty-state";
import { ROUTES } from "@/shared/constants/routes";

export default function BookNotFound() {
  return (
    <EmptyState
      title="Book not found"
      description="The book you are looking for does not exist or may have been removed."
      action={
        <div className="flex flex-col items-center gap-3">
          <BookX className="h-10 w-10 text-muted-foreground" />
          <Button asChild>
            <Link href={ROUTES.BOOKS}>Back to catalog</Link>
          </Button>
        </div>
      }
    />
  );
}
