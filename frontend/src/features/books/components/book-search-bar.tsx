"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

interface BookSearchBarProps {
  query: string;
  onQueryChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BookSearchBar({
  query,
  onQueryChange,
  disabled = false,
  className,
}: BookSearchBarProps) {
  return (
    <div className={cn("relative", className)}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search title, author, or category..."
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        disabled={disabled}
        className="pl-9"
        aria-label="Search books"
      />
    </div>
  );
}
