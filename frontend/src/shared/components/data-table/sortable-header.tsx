"use client";

import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import type { SortDirection } from "@/shared/components/data-table/types";

interface SortableHeaderProps {
  label: string;
  field: string;
  direction: SortDirection | null;
  onSort: (field: string) => void;
}

export function SortableHeader({ label, field, direction, onSort }: SortableHeaderProps) {
  const Icon = direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;

  return (
    <button
      type="button"
      onClick={() => onSort(field)}
      className="inline-flex items-center gap-1 font-medium transition-colors hover:text-foreground"
    >
      {label}
      <Icon className={cn("h-3.5 w-3.5", !direction && "opacity-40")} />
    </button>
  );
}
