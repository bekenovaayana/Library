"use client";

import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  ADMIN_DEFAULT_BOOKS_QUERY,
  type AvailabilityFilter,
  type BooksQueryParams,
} from "@/features/books/types/book";

export function useAdminBooksFilters() {
  const [page, setPage] = useState(ADMIN_DEFAULT_BOOKS_QUERY.page);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<AvailabilityFilter>(ADMIN_DEFAULT_BOOKS_QUERY.status ?? "ALL");
  const [sort, setSort] = useState(ADMIN_DEFAULT_BOOKS_QUERY.sort);

  const debouncedTitle = useDebounce(title, 300);
  const debouncedAuthor = useDebounce(author, 300);
  const debouncedCategory = useDebounce(category, 300);

  const queryParams: BooksQueryParams = useMemo(
    () => ({
      page,
      size: ADMIN_DEFAULT_BOOKS_QUERY.size,
      sort,
      ...(debouncedTitle && { title: debouncedTitle }),
      ...(debouncedAuthor && { author: debouncedAuthor }),
      ...(debouncedCategory && { category: debouncedCategory }),
      ...(status !== "ALL" && { status }),
    }),
    [page, sort, debouncedTitle, debouncedAuthor, debouncedCategory, status],
  );

  const hasActiveFilters = Boolean(
    title || author || category || (status && status !== "ALL"),
  );

  const clearFilters = useCallback(() => {
    setTitle("");
    setAuthor("");
    setCategory("");
    setStatus("ALL");
    setPage(0);
  }, []);

  const handleSortChange = useCallback((field: string) => {
    const [currentField, currentDir] = sort.split(",");
    const nextDir = currentField === field && currentDir === "asc" ? "desc" : "asc";
    setSort(`${field},${nextDir}`);
    setPage(0);
  }, [sort]);

  const getSortDirection = useCallback(
    (field: string): "asc" | "desc" | null => {
      const [currentField, dir] = sort.split(",");
      if (currentField !== field) return null;
      return dir === "desc" ? "desc" : "asc";
    },
    [sort],
  );

  return {
    page,
    setPage,
    title,
    setTitle,
    author,
    setAuthor,
    category,
    setCategory,
    status,
    setStatus,
    sort,
    setSort,
    queryParams,
    hasActiveFilters,
    clearFilters,
    handleSortChange,
    getSortDirection,
  };
}
