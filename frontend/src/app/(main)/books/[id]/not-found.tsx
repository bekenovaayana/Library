import Link from "next/link";
import { Button } from "@/shared/ui/button";
import { EmptyState } from "@/shared/components/empty-state";
import { ROUTES } from "@/shared/constants/routes";
import { ru } from "@/shared/i18n";

export default function BookNotFound() {
  return (
    <EmptyState
      title={ru.books.notFoundPage}
      description={ru.books.notFoundPageHint}
      action={
        <Button asChild>
          <Link href={ROUTES.BOOKS}>{ru.books.backToCatalog}</Link>
        </Button>
      }
    />
  );
}
