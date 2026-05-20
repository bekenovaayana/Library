"use client";

import { useCallback, useMemo, useState } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import {
  DEFAULT_BOOKS_QUERY,
  type AvailabilityFilter,
  type BooksQueryParams,
} from "@/features/books/types/book";

export function useBooksFilters() {
  const [page, setPage] = useState(DEFAULT_BOOKS_QUERY.page);
  const [size] = useState(DEFAULT_BOOKS_QUERY.size);
  const [sort, setSort] = useState(DEFAULT_BOOKS_QUERY.sort);
  const [titleInput, setTitleInput] = useState("");
  const [authorInput, setAuthorInput] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<AvailabilityFilter>("ALL");

  const debouncedTitle = useDebounce(titleInput);
  const debouncedAuthor = useDebounce(authorInput);
  const debouncedCategory = useDebounce(category);

  const queryParams: BooksQueryParams = useMemo(
    () => ({
      page,
      size,
      sort,
      title: debouncedTitle || undefined,
      author: debouncedAuthor || undefined,
      category: debouncedCategory || undefined,
      status,
    }),
    [page, size, sort, debouncedTitle, debouncedAuthor, debouncedCategory, status],
  );

  const resetPage = useCallback(() => setPage(0), []);

  const handleTitleChange = useCallback(
    (value: string) => {
      setTitleInput(value);
      setPage(0);
    },
    [],
  );

  const handleAuthorChange = useCallback(
    (value: string) => {
      setAuthorInput(value);
      setPage(0);
    },
    [],
  );

  const handleCategoryChange = useCallback(
    (value: string) => {
      setCategory(value);
      setPage(0);
    },
    [],
  );

  const handleStatusChange = useCallback(
    (value: AvailabilityFilter) => {
      setStatus(value);
      setPage(0);
    },
    [],
  );

  const handleSortChange = useCallback(
    (value: string) => {
      setSort(value);
      setPage(0);
    },
    [],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearFilters = useCallback(() => {
    setTitleInput("");
    setAuthorInput("");
    setCategory("");
    setStatus("ALL");
    setSort(DEFAULT_BOOKS_QUERY.sort);
    setPage(0);
  }, []);

  const hasActiveFilters = Boolean(
    titleInput || authorInput || category || status !== "ALL",
  );

  return {
    queryParams,
    titleInput,
    authorInput,
    category,
    status,
    sort,
    page,
    hasActiveFilters,
    handleTitleChange,
    handleAuthorChange,
    handleCategoryChange,
    handleStatusChange,
    handleSortChange,
    handlePageChange,
    clearFilters,
    resetPage,
  };
}
