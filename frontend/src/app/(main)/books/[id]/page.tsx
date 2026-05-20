import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookById } from "@/features/books/api/getBookById";
import { BookDetailsView } from "@/features/books/components/book-details-view";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return { title: "Book Not Found | Library" };
  }

  try {
    const book = await getBookById(bookId);

    if (!book) {
      return { title: "Book Not Found | Library" };
    }

    return {
      title: `${book.title} | Library`,
      description: `${book.title} by ${book.author} — ${book.category}. Status: ${book.status}.`,
      openGraph: {
        title: book.title,
        description: `By ${book.author} · ${book.category}`,
      },
    };
  } catch {
    return { title: "Book Details | Library" };
  }
}

export default async function BookDetailPage({ params }: BookDetailPageProps) {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    notFound();
  }

  const book = await getBookById(bookId);

  if (!book) {
    notFound();
  }

  return <BookDetailsView bookId={bookId} initialBook={book} />;
}
