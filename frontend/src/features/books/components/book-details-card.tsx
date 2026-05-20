import { Card, CardContent } from "@/shared/ui/card";
import type { BookDetail } from "@/features/books/types/book-detail";
import { BookInfo } from "@/features/books/components/book-info";

interface BookDetailsCardProps {
  book: BookDetail;
}

export function BookDetailsCard({ book }: BookDetailsCardProps) {
  return (
    <Card>
      <CardContent className="p-6 sm:p-8">
        <BookInfo book={book} />
      </CardContent>
    </Card>
  );
}
