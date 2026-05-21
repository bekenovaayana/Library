import { ru } from "@/shared/i18n";

export type BookStatus = "AVAILABLE" | "BORROWED";

export type AvailabilityFilter = BookStatus | "ALL";

export type BookSortField = "title" | "author";

export type SortDirection = "asc" | "desc";

export interface Book {
  id: number;
  title: string;
  author: string;
  category: string;
  status: BookStatus;
  coverUrl?: string | null;
  userHasReservation?: boolean;
  reservationQueueSize?: number;
}

export interface BookPayload {
  title: string;
  author: string;
  category: string;
  coverUrl?: string;
}

export interface BooksQueryParams {
  page: number;
  size: number;
  sort: string;
  q?: string;
  title?: string;
  author?: string;
  category?: string;
  status?: AvailabilityFilter;
}

export const DEFAULT_BOOKS_QUERY: BooksQueryParams = {
  page: 0,
  size: 12,
  sort: "title,asc",
  status: "ALL",
};

export const SORT_OPTIONS = [
  { value: "title,asc", label: ru.sort.titleAsc },
  { value: "title,desc", label: ru.sort.titleDesc },
  { value: "author,asc", label: ru.sort.authorAsc },
  { value: "author,desc", label: ru.sort.authorDesc },
  { value: "category,asc", label: ru.sort.categoryAsc },
  { value: "category,desc", label: ru.sort.categoryDesc },
] as const;

export const ADMIN_DEFAULT_BOOKS_QUERY: BooksQueryParams = {
  page: 0,
  size: 10,
  sort: "title,asc",
  status: "ALL",
};
