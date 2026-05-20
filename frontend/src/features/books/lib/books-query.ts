import type { BooksQueryParams } from "@/features/books/types/book";

export function hasActiveFilters(params: BooksQueryParams): boolean {
  return Boolean(
    params.q ||
      params.title ||
      params.author ||
      params.category ||
      (params.status && params.status !== "ALL"),
  );
}

export function buildPageParams(params: BooksQueryParams): Record<string, string | number> {
  const query: Record<string, string | number> = {
    page: params.page,
    size: params.size,
    sort: params.sort,
  };

  if (params.q) query.q = params.q;
  if (params.title) query.title = params.title;
  if (params.author) query.author = params.author;
  if (params.category) query.category = params.category;
  if (params.status && params.status !== "ALL") query.status = params.status;

  return query;
}
