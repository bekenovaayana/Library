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
  { value: "title,asc", label: "Title (A–Z)" },
  { value: "title,desc", label: "Title (Z–A)" },
  { value: "author,asc", label: "Author (A–Z)" },
  { value: "author,desc", label: "Author (Z–A)" },
  { value: "category,asc", label: "Category (A–Z)" },
  { value: "category,desc", label: "Category (Z–A)" },
] as const;

export const ADMIN_DEFAULT_BOOKS_QUERY: BooksQueryParams = {
  page: 0,
  size: 10,
  sort: "title,asc",
  status: "ALL",
};
