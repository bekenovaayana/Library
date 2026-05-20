"use client";

import { useCallback, useState } from "react";
import { useDebounce } from "@/shared/hooks/use-debounce";
import type { SortDirection } from "@/shared/components/data-table/types";

interface UsePaginatedTableStateOptions {
  defaultPage?: number;
  defaultSize?: number;
  defaultSort: string;
  debounceMs?: number;
}

export function usePaginatedTableState({
  defaultPage = 0,
  defaultSize = 10,
  defaultSort,
  debounceMs = 300,
}: UsePaginatedTableStateOptions) {
  const [page, setPage] = useState(defaultPage);
  const [size] = useState(defaultSize);
  const [sort, setSort] = useState(defaultSort);
  const [search, setSearch] = useState("");

  const debouncedSearch = useDebounce(search, debounceMs);

  const handleSortChange = useCallback(
    (field: string) => {
      const [currentField, currentDir] = sort.split(",");
      const nextDir: SortDirection =
        currentField === field && currentDir === "asc" ? "desc" : "asc";
      setSort(`${field},${nextDir}`);
      setPage(0);
    },
    [sort],
  );

  const getSortDirection = useCallback(
    (field: string): SortDirection | null => {
      const [currentField, dir] = sort.split(",");
      if (currentField !== field) return null;
      return dir === "desc" ? "desc" : "asc";
    },
    [sort],
  );

  const resetPage = useCallback(() => setPage(0), []);

  return {
    page,
    size,
    sort,
    search,
    debouncedSearch,
    setPage,
    setSort,
    setSearch,
    handleSortChange,
    getSortDirection,
    resetPage,
  };
}
