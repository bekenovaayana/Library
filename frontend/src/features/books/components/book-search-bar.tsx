"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

interface BookSearchBarProps {
  title: string;
  author: string;
  onTitleChange: (value: string) => void;
  onAuthorChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
}

export function BookSearchBar({
  title,
  author,
  onTitleChange,
  onAuthorChange,
  disabled = false,
  className,
}: BookSearchBarProps) {
  return (
    <div className={cn("grid gap-3 xs:grid-cols-2", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by title..."
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          disabled={disabled}
          className="pl-9"
          aria-label="Search by title"
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search by author..."
          value={author}
          onChange={(e) => onAuthorChange(e.target.value)}
          disabled={disabled}
          className="pl-9"
          aria-label="Search by author"
        />
      </div>
    </div>
  );
}
