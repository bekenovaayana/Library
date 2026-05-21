"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { CategoryAutocomplete } from "@/features/books/components/category-autocomplete";
import { cn } from "@/shared/lib/utils";
import { SORT_OPTIONS, type AvailabilityFilter } from "@/features/books/types/book";
import { bookStatusLabel, ru } from "@/shared/i18n";

interface BookFiltersProps {
  category: string;
  status: AvailabilityFilter;
  sort: string;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: AvailabilityFilter) => void;
  onSortChange: (value: string) => void;
  onClear: () => void;
  hasActiveFilters: boolean;
  disabled?: boolean;
  showHeading?: boolean;
  className?: string;
}

const selectClassName =
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

export function BookFilters({
  category,
  status,
  sort,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onClear,
  hasActiveFilters,
  disabled = false,
  showHeading = true,
  className,
}: BookFiltersProps) {
  return (
    <div className={cn("space-y-3", className)}>
      {showHeading && (
        <div className="hidden items-center gap-2 text-sm font-medium text-muted-foreground lg:flex">
          <Filter className="h-4 w-4" />
          {ru.books.filtersSorting}
        </div>
      )}

      <div className="grid gap-3 xs:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label htmlFor="category-filter" className="text-xs font-medium text-muted-foreground">
            {ru.books.category}
          </label>
          <CategoryAutocomplete
            id="category-filter"
            value={category}
            onChange={onCategoryChange}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="status-filter" className="text-xs font-medium text-muted-foreground">
            {ru.books.availability}
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as AvailabilityFilter)}
            disabled={disabled}
            className={selectClassName}
          >
            <option value="ALL">{ru.common.all}</option>
            <option value="AVAILABLE">{bookStatusLabel("AVAILABLE")}</option>
            <option value="BORROWED">{bookStatusLabel("BORROWED")}</option>
          </select>
        </div>

        <div className="space-y-1.5 xs:col-span-2 lg:col-span-1">
          <label htmlFor="sort-filter" className="text-xs font-medium text-muted-foreground">
            {ru.books.sortBy}
          </label>
          <select
            id="sort-filter"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={disabled}
            className={selectClassName}
          >
            {SORT_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-end xs:col-span-2 lg:col-span-1">
          <Button
            variant="outline"
            onClick={onClear}
            disabled={disabled || !hasActiveFilters}
            className="w-full min-h-10"
          >
            <X className="mr-2 h-4 w-4" />
            {ru.books.clearFilters}
          </Button>
        </div>
      </div>
    </div>
  );
}
