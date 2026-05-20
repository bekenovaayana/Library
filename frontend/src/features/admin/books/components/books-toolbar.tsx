"use client";

import { Plus, Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { FormSelect } from "@/shared/components/form";
import { SORT_OPTIONS, type AvailabilityFilter } from "@/features/books/types/book";

interface BooksToolbarProps {
  title: string;
  author: string;
  category: string;
  status: AvailabilityFilter;
  sort: string;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  onCategoryChange: (value: string) => void;
  onStatusChange: (value: AvailabilityFilter) => void;
  onSortChange: (value: string) => void;
  onClearFilters: () => void;
  onAddBook: () => void;
  hasActiveFilters: boolean;
  disabled?: boolean;
}

export function BooksToolbar({
  title,
  author,
  category,
  status,
  sort,
  onTitleChange,
  onAuthorChange,
  onCategoryChange,
  onStatusChange,
  onSortChange,
  onClearFilters,
  onAddBook,
  hasActiveFilters,
  disabled = false,
}: BooksToolbarProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by title..."
            value={title}
            onChange={(e) => onTitleChange(e.target.value)}
            disabled={disabled}
            className="pl-9"
          />
        </div>
        <Button onClick={onAddBook} disabled={disabled} className="shrink-0">
          <Plus className="mr-2 h-4 w-4" />
          Add book
        </Button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-1.5">
          <label htmlFor="admin-author-filter" className="text-xs font-medium text-muted-foreground">
            Author
          </label>
          <Input
            id="admin-author-filter"
            placeholder="Filter author..."
            value={author}
            onChange={(e) => onAuthorChange(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="admin-category-filter"
            className="text-xs font-medium text-muted-foreground"
          >
            Category
          </label>
          <Input
            id="admin-category-filter"
            placeholder="Filter category..."
            value={category}
            onChange={(e) => onCategoryChange(e.target.value)}
            disabled={disabled}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-status-filter" className="text-xs font-medium text-muted-foreground">
            Status
          </label>
          <FormSelect
            id="admin-status-filter"
            value={status}
            onChange={(e) => onStatusChange(e.target.value as AvailabilityFilter)}
            disabled={disabled}
            options={[
              { value: "ALL", label: "All statuses" },
              { value: "AVAILABLE", label: "Available" },
              { value: "BORROWED", label: "Borrowed" },
            ]}
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="admin-sort-filter" className="text-xs font-medium text-muted-foreground">
            Sort
          </label>
          <FormSelect
            id="admin-sort-filter"
            value={sort}
            onChange={(e) => onSortChange(e.target.value)}
            disabled={disabled}
            options={SORT_OPTIONS.map((o) => ({ value: o.value, label: o.label }))}
          />
        </div>

        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={onClearFilters}
            disabled={disabled || !hasActiveFilters}
            className="w-full"
          >
            <X className="mr-2 h-4 w-4" />
            Clear
          </Button>
        </div>
      </div>
    </div>
  );
}
