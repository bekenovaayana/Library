import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getBookById } from "@/features/books/api/getBookById";
import { BookDetailsView } from "@/features/books/components/book-details-view";
import { bookStatusLabel, ru } from "@/shared/i18n";
import { env } from "@/shared/config/env";

interface BookDetailPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: BookDetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const bookId = Number(id);

  if (Number.isNaN(bookId)) {
    return { title: `${ru.books.metaNotFound} | ${env.appName}` };
  }

  try {
    const book = await getBookById(bookId);

    if (!book) {
      return { title: `${ru.books.metaNotFound} | ${env.appName}` };
    }

    return {
      title: `${book.title} | ${env.appName}`,
      description: `${book.title} — ${book.author} · ${book.category}. ${ru.books.metaStatus(bookStatusLabel(book.status))}.`,
      openGraph: {
        title: book.title,
        description: ru.books.metaBy(book.author, book.category),
      },
    };
  } catch {
    return { title: `${ru.books.metaDetails} | ${env.appName}` };
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
