import Link from "next/link";
import { BookOpen, User } from "lucide-react";
import { BorrowButton } from "@/features/borrow/components/borrow-button";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/shared/ui/card";
import { bookDetailRoute } from "@/shared/constants/routes";
import type { Book } from "@/features/books/types/book";

interface BookCardProps {
  book: Book;
  className?: string;
}

const statusConfig = {
  AVAILABLE: {
    label: "Available",
    className: "bg-emerald-500/15 text-emerald-700 ring-1 ring-emerald-500/20 dark:text-emerald-400",
  },
  BORROWED: {
    label: "Borrowed",
    className: "bg-amber-500/15 text-amber-700 ring-1 ring-amber-500/20 dark:text-amber-400",
  },
} as const;

export function BookCard({ book, className }: BookCardProps) {
  const status = statusConfig[book.status];

  return (
    <Card
      className={cn(
        "group flex h-full flex-col overflow-hidden border-border/80 transition-all duration-200",
        "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
        className,
      )}
    >
      <CardHeader className="space-y-3 pb-0">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="min-w-0 flex-1 text-base font-semibold leading-snug sm:text-[1.05rem]">
            <Link
              href={bookDetailRoute(book.id)}
              className="line-clamp-2 transition-colors hover:text-primary"
            >
              {book.title}
            </Link>
          </CardTitle>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide",
              status.className,
            )}
          >
            {status.label}
          </span>
        </div>
        <span className="inline-flex w-fit max-w-full rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {book.category}
        </span>
      </CardHeader>

      <CardContent className="flex-1 space-y-2.5 pb-4 pt-3">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <User className="h-4 w-4 shrink-0 opacity-70" aria-hidden />
          <span className="line-clamp-1">{book.author}</span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground/80">
          <BookOpen className="h-3.5 w-3.5 shrink-0" aria-hidden />
          <span>Catalog ID {book.id}</span>
        </div>
      </CardContent>

      <CardFooter className="grid grid-cols-2 gap-2 border-t bg-muted/20 p-3 sm:p-4">
        <Button variant="outline" size="sm" asChild className="h-9 w-full text-xs sm:text-sm">
          <Link href={bookDetailRoute(book.id)}>Details</Link>
        </Button>
        {book.status === "AVAILABLE" ? (
          <BorrowButton
            bookId={book.id}
            bookTitle={book.title}
            status={book.status}
            size="sm"
            className="h-9 w-full text-xs sm:text-sm"
          />
        ) : (
          <Button size="sm" disabled className="h-9 w-full text-xs sm:text-sm">
            Taken
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}
