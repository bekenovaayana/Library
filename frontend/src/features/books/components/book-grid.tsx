import { cn } from "@/shared/lib/utils";
import { BookCard } from "@/features/books/components/book-card";
import { BookCardSkeleton } from "@/features/books/components/book-card-skeleton";
import type { Book } from "@/features/books/types/book";

interface BookGridProps {
  books: Book[];
  isLoading?: boolean;
  isFetching?: boolean;
  skeletonCount?: number;
  className?: string;
}

export function BookGrid({
  books,
  isLoading = false,
  isFetching = false,
  skeletonCount = 12,
  className,
}: BookGridProps) {
  if (isLoading) {
    return (
      <div
        className={cn(
          "grid grid-cols-1 gap-4 xs:grid-cols-2 md:gap-5 lg:grid-cols-3 2xl:grid-cols-4",
          className,
        )}
      >
        {Array.from({ length: skeletonCount }).map((_, index) => (
          <BookCardSkeleton key={index} />
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 transition-opacity duration-200 xs:grid-cols-2 md:gap-5 lg:grid-cols-3 2xl:grid-cols-4",
        isFetching && "opacity-60",
        className,
      )}
    >
      {books.map((book) => (
        <BookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
