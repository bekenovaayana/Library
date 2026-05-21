import { ru } from "@/shared/i18n/ru";
import type { BookStatus } from "@/features/books/types/book";

export function bookStatusLabel(status: BookStatus): string {
  return ru.bookStatus[status];
}

export function bookStatusLongLabel(status: BookStatus): string {
  return status === "AVAILABLE" ? ru.bookStatus.availableLong : ru.bookStatus.borrowedLong;
}

export function borrowStatusLabel(status: "ACTIVE" | "RETURNED" | "OVERDUE"): string {
  return ru.borrowStatus[status];
}

export function roleLabel(role: "USER" | "ADMIN"): string {
  return ru.roles[role];
}
