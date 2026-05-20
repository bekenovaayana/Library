"use client";

import { useState } from "react";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { BookStatusBadge } from "@/features/books/components/book-status-badge";
import { DeleteConfirmationModal } from "@/features/admin/books/components/delete-confirmation-modal";
import { BookFormModal } from "@/features/admin/books/components/book-form-modal";
import { useDeleteBook } from "@/features/admin/books/hooks/useDeleteBook";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/table";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import { cn } from "@/shared/lib/utils";
import type { Book } from "@/features/books/types/book";

type SortableField = "title" | "author" | "category";

interface BooksTableProps {
  books: Book[];
  onSort: (field: SortableField) => void;
  getSortDirection: (field: SortableField) => "asc" | "desc" | null;
  isLoading?: boolean;
}

function SortableHeader({
  label,
  field,
  direction,
  onSort,
}: {
  label: string;
  field: SortableField;
  direction: "asc" | "desc" | null;
  onSort: (field: SortableField) => void;
}) {
  const Icon =
    direction === "asc" ? ArrowUp : direction === "desc" ? ArrowDown : ArrowUpDown;

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

export function BooksTable({ books, onSort, getSortDirection, isLoading }: BooksTableProps) {
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deletingBook, setDeletingBook] = useState<Book | null>(null);
  const deleteMutation = useDeleteBook();

  const pendingDeleteId =
    deleteMutation.isPending && typeof deleteMutation.variables === "number"
      ? deleteMutation.variables
      : null;

  const handleDeleteConfirm = () => {
    if (!deletingBook) return;
    deleteMutation.mutate(deletingBook.id, {
      onSuccess: () => setDeletingBook(null),
    });
  };

  return (
    <>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                <SortableHeader
                  label="Title"
                  field="title"
                  direction={getSortDirection("title")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>
                <SortableHeader
                  label="Author"
                  field="author"
                  direction={getSortDirection("author")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <SortableHeader
                  label="Category"
                  field="category"
                  direction={getSortDirection("category")}
                  onSort={onSort}
                />
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading && books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-32 text-center">
                  <Spinner size="lg" className="mx-auto" />
                </TableCell>
              </TableRow>
            ) : books.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  No books found
                </TableCell>
              </TableRow>
            ) : (
              books.map((book) => {
                const isRowLoading = pendingDeleteId === book.id;

                return (
                  <TableRow
                    key={book.id}
                    className={cn(isRowLoading && "pointer-events-none opacity-60")}
                  >
                    <TableCell className="font-medium">
                      <span className="line-clamp-2">{book.title}</span>
                    </TableCell>
                    <TableCell>{book.author}</TableCell>
                    <TableCell className="hidden md:table-cell">{book.category}</TableCell>
                    <TableCell>
                      <BookStatusBadge status={book.status} />
                    </TableCell>
                    <TableCell className="text-right">
                      {isRowLoading ? (
                        <Spinner size="sm" className="ml-auto" />
                      ) : (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" aria-label={`Actions for ${book.title}`}>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setEditingBook(book)}>
                              <Pencil className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive focus:text-destructive"
                              onClick={() => setDeletingBook(book)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <BookFormModal
        open={Boolean(editingBook)}
        onOpenChange={(open) => !open && setEditingBook(null)}
        book={editingBook}
      />

      <DeleteConfirmationModal
        open={Boolean(deletingBook)}
        onOpenChange={(open) => !open && setDeletingBook(null)}
        bookTitle={deletingBook?.title ?? ""}
        onConfirm={handleDeleteConfirm}
        isLoading={deleteMutation.isPending}
      />
    </>
  );
}
