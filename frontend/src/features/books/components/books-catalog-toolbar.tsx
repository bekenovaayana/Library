"use client";

import { SlidersHorizontal } from "lucide-react";
import { useState } from "react";
import { BookFilters } from "@/features/books/components/book-filters";
import { BookSearchBar } from "@/features/books/components/book-search-bar";
import { Button } from "@/shared/ui/button";
import { cn } from "@/shared/lib/utils";
import type { AvailabilityFilter } from "@/features/books/types/book";

interface BooksCatalogToolbarProps {
  title: string;
  author: string;
  category: string;
  status: AvailabilityFilter;
  sort: string;
  hasActiveFilters: boolean;
  disabled?: boolean;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: AvailabilityFilter) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
}

export function BooksCatalogToolbar({
  title,
  author,
  category,
  status,
  sort,
  hasActiveFilters,
  disabled = false,
  onTitleChange,
  onAuthorChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onClear,
}: BooksCatalogToolbarProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);

  return (
    <section
      className="rounded-xl border bg-card/50 p-4 shadow-sm backdrop-blur-sm md:p-5"
      aria-label="Search and filters"
    >
      <BookSearchBar
        title={title}
        author={author}
        onTitleChange={onTitleChange}
        onAuthorChange={onAuthorChange}
        disabled={disabled}
      />

      <div className="mt-4 flex items-center justify-between gap-3 border-t pt-4 lg:hidden">
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full justify-between"
          onClick={() => setFiltersOpen((open) => !open)}
          aria-expanded={filtersOpen}
          aria-controls="books-filters-panel"
        >
          <span className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4" />
            Filters & sorting
          </span>
          {hasActiveFilters && (
            <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-primary-foreground">
              Active
            </span>
          )}
        </Button>
      </div>

      <div
        id="books-filters-panel"
        className={cn(
          "mt-4 lg:mt-4",
          filtersOpen ? "block" : "hidden lg:block",
        )}
      >
        <BookFilters
          category={category}
          status={status}
          sort={sort}
          onCategoryChange={onCategoryChange}
          onStatusChange={onStatusChange}
          onSortChange={onSortChange}
          onClear={onClear}
          hasActiveFilters={hasActiveFilters}
          disabled={disabled}
          showHeading={false}
          className="lg:mt-0"
        />
      </div>
    </section>
  );
}
