export function formatBorrowDate(dateString: string | null): string {
  if (!dateString) return "—";

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(dateString));
}
