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
  const [queryInput, setQueryInput] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState<AvailabilityFilter>("ALL");

  const debouncedQuery = useDebounce(queryInput);
  const debouncedCategory = useDebounce(category);

  const queryParams: BooksQueryParams = useMemo(
    () => ({
      page,
      size,
      sort,
      q: debouncedQuery || undefined,
      category: debouncedCategory || undefined,
      status,
    }),
    [page, size, sort, debouncedQuery, debouncedCategory, status],
  );

  const handleQueryChange = useCallback((value: string) => {
    setQueryInput(value);
    setPage(0);
  }, []);

  const handleCategoryChange = useCallback((value: string) => {
    setCategory(value);
    setPage(0);
  }, []);

  const handleStatusChange = useCallback((value: AvailabilityFilter) => {
    setStatus(value);
    setPage(0);
  }, []);

  const handleSortChange = useCallback((value: string) => {
    setSort(value);
    setPage(0);
  }, []);

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const clearFilters = useCallback(() => {
    setQueryInput("");
    setCategory("");
    setStatus("ALL");
    setSort(DEFAULT_BOOKS_QUERY.sort);
    setPage(0);
  }, []);

  const hasActiveFilters = Boolean(queryInput || category || status !== "ALL");

  return {
    queryParams,
    queryInput,
    category,
    status,
    sort,
    page,
    hasActiveFilters,
    handleQueryChange,
    handleCategoryChange,
    handleStatusChange,
    handleSortChange,
    handlePageChange,
    clearFilters,
  };
};
