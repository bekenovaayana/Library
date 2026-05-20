"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

interface DataTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  onClear?: () => void;
  hasActiveFilters?: boolean;
  disabled?: boolean;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  className?: string;
}

export function DataTableToolbar({
  search,
  onSearchChange,
  searchPlaceholder = "Search...",
  onClear,
  hasActiveFilters = false,
  disabled = false,
  filters,
  actions,
  className,
}: DataTableToolbarProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            disabled={disabled}
            className="pl-9"
          />
        </div>
        {actions}
      </div>

      {filters ? (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {filters}
          {onClear ? (
            <div className="flex items-end">
              <Button
                variant="outline"
                onClick={onClear}
                disabled={disabled || !hasActiveFilters}
                className="w-full"
              >
                <X className="mr-2 h-4 w-4" />
                Clear
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
