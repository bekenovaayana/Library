"use client";

import { useQuery } from "@tanstack/react-query";
import { useDebounce } from "@/shared/hooks/use-debounce";
import { booksApi } from "@/features/books/api/booksApi";
import { Input } from "@/shared/ui/input";
import { cn } from "@/shared/lib/utils";

interface CategoryAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  id?: string;
}

export function CategoryAutocomplete({
  value,
  onChange,
  disabled,
  id = "category-filter",
}: CategoryAutocompleteProps) {
  const debounced = useDebounce(value, 200);

  const { data: suggestions = [] } = useQuery({
    queryKey: ["books", "categories", debounced],
    queryFn: () => booksApi.getCategories(debounced || undefined),
    staleTime: 60_000,
    retry: false,
    meta: { silent: true },
  });

  const listId = `${id}-suggestions`;

  return (
    <div className="relative">
      <Input
        id={id}
        list={listId}
        placeholder="e.g. Programming"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
      <datalist id={listId} className={cn(suggestions.length === 0 && "hidden")}>
        {suggestions.map((category) => (
          <option key={category} value={category} />
        ))}
      </datalist>
    </div>
  );
}
