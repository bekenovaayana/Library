"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  BookMarked,
  BookOpen,
  CheckCircle2,
  Library,
  Shield,
} from "lucide-react";
import { useMyBorrows } from "@/features/borrow/hooks/useMyBorrows";
import { BorrowHistoryCard } from "@/features/borrow/components/borrow-history-card";
import { useAuthStore } from "@/store/authStore";
import { ROUTES } from "@/shared/constants/routes";
import { DashboardGrid, StatsCard, StatsCardSkeleton } from "@/shared/components/dashboard";
import { EmptyState } from "@/shared/components/empty-state";
import { ErrorState } from "@/shared/components/error-state";
import { DataTablePagination } from "@/shared/components/data-table";
import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { ru } from "@/shared/i18n";

const PAGE_SIZE = 6;

export function UserDashboardContent() {
  const user = useAuthStore((state) => state.user);
  const isAdmin = user?.role === "ADMIN";
  const [page, setPage] = useState(0);

  const { data, isLoading, isError, error, refetch } = useMyBorrows({
    page,
    size: PAGE_SIZE,
    sort: "borrowDate,desc",
  });

  const records = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const activeBorrows = records.filter((r) => r.status === "ACTIVE");
  const overdueCount = records.filter((r) => r.overdue).length;

  return (
    <div className="mx-auto w-full max-w-[1400px] space-y-8">
      <header className="space-y-1">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {user?.username ? ru.dashboard.welcome(user.username) : ru.auth.welcomeBack}
        </h1>
        <p className="text-sm text-muted-foreground sm:text-base">{ru.dashboard.subtitle}</p>
      </header>

      {isAdmin && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Shield className="h-4 w-4 text-primary" />
              {ru.dashboard.adminBadge}
            </CardTitle>
            <CardDescription>{ru.dashboard.adminHint}</CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild size="sm">
              <Link href={ROUTES.ADMIN}>
                {ru.dashboard.openAdmin}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <Button asChild variant="default" className="h-auto justify-start gap-3 px-4 py-4">
          <Link href={ROUTES.BOOKS}>
            <BookOpen className="h-5 w-5 shrink-0" />
            <span className="text-left">
              <span className="block font-semibold">{ru.dashboard.browseCatalog}</span>
              <span className="block text-xs font-normal opacity-90">
                {ru.dashboard.browseCatalogDesc}
              </span>
            </span>
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-auto justify-start gap-3 px-4 py-4">
          <Link href={ROUTES.MY_BOOKS}>
            <BookMarked className="h-5 w-5 shrink-0" />
            <span className="text-left">
              <span className="block font-semibold">{ru.dashboard.myBooksCard}</span>
              <span className="block text-xs font-normal text-muted-foreground">
                {ru.dashboard.myBooksCardDesc}
              </span>
            </span>
          </Link>
        </Button>
      </div>

      {isError && (
        <ErrorState
          error={error}
          message={getApiErrorMessage(error)}
          onRetry={() => refetch()}
        />
      )}

      {!isError && isLoading && (
        <DashboardGrid className="sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <StatsCardSkeleton key={i} />
          ))}
        </DashboardGrid>
      )}

      {!isError && !isLoading && (
        <>
          <DashboardGrid className="sm:grid-cols-2 lg:grid-cols-4">
            <StatsCard
              title={ru.dashboard.statBorrowed}
              value={activeBorrows.length}
              description={ru.dashboard.statOnPage}
              icon={BookMarked}
              iconClassName="bg-amber-500/10 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400"
              animationIndex={0}
            />
            <StatsCard
              title={ru.dashboard.statOverdue}
              value={overdueCount}
              description={ru.dashboard.statNeedsReturn}
              icon={BookMarked}
              iconClassName="bg-destructive/10 [&_svg]:text-destructive"
              animationIndex={1}
            />
            <StatsCard
              title={ru.dashboard.statTotal}
              value={totalElements}
              description={ru.dashboard.statAllTime}
              icon={Library}
              iconClassName="bg-violet-500/10 [&_svg]:text-violet-600 dark:[&_svg]:text-violet-400"
              animationIndex={2}
            />
            <StatsCard
              title={ru.dashboard.statReturned}
              value={records.filter((r) => r.status === "RETURNED").length}
              description={ru.dashboard.statOnPage}
              icon={CheckCircle2}
              iconClassName="bg-emerald-500/10 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400"
              animationIndex={3}
            />
          </DashboardGrid>

          <section className="space-y-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-xl font-semibold tracking-tight">{ru.dashboard.historyTitle}</h2>
                <p className="text-sm text-muted-foreground">{ru.dashboard.historySubtitle}</p>
              </div>
              {totalElements > 0 && (
                <Button variant="outline" size="sm" asChild className="shrink-0">
                  <Link href={ROUTES.MY_BOOKS}>
                    {ru.dashboard.fullHistory}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              )}
            </div>

            {totalElements === 0 ? (
              <EmptyState
                title={ru.dashboard.noBorrows}
                description={ru.dashboard.noBorrowsHint}
                action={
                  <Button asChild>
                    <Link href={ROUTES.BOOKS}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      {ru.dashboard.browseCatalogBtn}
                    </Link>
                  </Button>
                }
              />
            ) : (
              <>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {records.map((record) => (
                    <BorrowHistoryCard key={record.borrowId} record={record} />
                  ))}
                </div>
                <DataTablePagination
                  page={page}
                  totalPages={data?.totalPages ?? 0}
                  totalElements={totalElements}
                  onPageChange={setPage}
                  disabled={isLoading}
                />
              </>
            )}
          </section>
        </>
      )}
    </div>
  );
}
