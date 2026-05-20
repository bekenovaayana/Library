import { BookOpen, Calendar, Hash, Tag, User } from "lucide-react";
import type { BookDetail } from "@/features/books/types/book-detail";
import { BookStatusBadge } from "@/features/books/components/book-status-badge";

interface BookInfoProps {
  book: BookDetail;
}

function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}

export function BookInfo({ book }: BookInfoProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{book.title}</h1>
        <BookStatusBadge status={book.status} showAvailability size="lg" />
      </div>

      <dl className="grid gap-4 sm:grid-cols-2">
        <div className="flex items-start gap-3 rounded-lg border p-4">
          <User className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Author</dt>
            <dd className="mt-1 text-base font-medium">{book.author}</dd>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Tag className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Category</dt>
            <dd className="mt-1 text-base font-medium">{book.category}</dd>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <Hash className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Book ID</dt>
            <dd className="mt-1 text-base font-medium">#{book.id}</dd>
          </div>
        </div>

        <div className="flex items-start gap-3 rounded-lg border p-4">
          <BookOpen className="mt-0.5 h-5 w-5 shrink-0 text-muted-foreground" />
          <div>
            <dt className="text-sm font-medium text-muted-foreground">Status</dt>
            <dd className="mt-1 text-base font-medium">{book.status}</dd>
          </div>
        </div>
      </dl>

      <section className="rounded-lg border bg-muted/30 p-5">
        <h2 className="text-lg font-semibold">Borrow information</h2>

        {book.currentBorrow ? (
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <div>
              <dt className="text-sm text-muted-foreground">Borrowed by</dt>
              <dd className="font-medium">{book.currentBorrow.username}</dd>
            </div>
            <div className="flex items-start gap-2">
              <Calendar className="mt-0.5 h-4 w-4 text-muted-foreground" />
              <div>
                <dt className="text-sm text-muted-foreground">Borrow date</dt>
                <dd className="font-medium">{formatDate(book.currentBorrow.borrowDate)}</dd>
              </div>
            </div>
            <div>
              <dt className="text-sm text-muted-foreground">Borrow record ID</dt>
              <dd className="font-medium">#{book.currentBorrow.borrowId}</dd>
            </div>
            <div className="sm:col-span-2">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                This book is currently on loan and not available for borrowing.
              </p>
            </div>
          </dl>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            No active borrow record. This book is available in the library catalog and ready
            to be borrowed.
          </p>
        )}
      </section>
    </div>
  );
}
