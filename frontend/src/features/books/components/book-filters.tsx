"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";
import { SORT_OPTIONS, type AvailabilityFilter } from "@/features/books/types/book";

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
          Filters & sorting
        </div>
      )}

      <div className="grid gap-3 xs:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-1.5">
          <label htmlFor="category-filter" className="text-xs font-medium text-muted-foreground">
            Category
          </label>
          <Input
            id="category-filter"
            placeholder="e.g. Programming"
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="status-filter" className="text-xs font-medium text-muted-foreground">
            Availability
          </label>
          <select
            id="status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as AvailabilityFilter)}
            disabled={disabled}
            className={selectClassName}
          >
            <option value="ALL">All</option>
            <option value="AVAILABLE">Available</option>
            <option value="BORROWED">Borrowed</option>
          </select>
        </div>

        <div className="space-y-1.5 xs:col-span-2 lg:col-span-1">
          <label htmlFor="sort-filter" className="text-xs font-medium text-muted-foreground">
            Sort by
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
            Clear filters
          </Button>
        </div>
      </div>
    </div>
  );
}
