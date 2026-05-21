"use client";

import { BookMarked, BookOpen, Library, Users } from "lucide-react";
import { useAdminStatistics } from "@/features/admin/hooks/useAdminStatistics";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import { LibraryOverviewCharts } from "@/features/admin/components/library-overview-chart";
import { DashboardGrid, StatsCard, StatsCardSkeleton } from "@/shared/components/dashboard";
import { ErrorState } from "@/shared/components/error-state";
import { getApiErrorMessage } from "@/services/api/apiClient";
import { ru } from "@/shared/i18n";

const STAT_CONFIG = [
  {
    key: "totalUsers" as const,
    title: ru.admin.totalUsers,
    description: ru.admin.totalUsersDesc,
    icon: Users,
    iconClassName: "bg-blue-500/10 [&_svg]:text-blue-600 dark:[&_svg]:text-blue-400",
  },
  {
    key: "totalBooks" as const,
    title: ru.admin.totalBooks,
    description: ru.admin.totalBooksDesc,
    icon: BookOpen,
    iconClassName: "bg-violet-500/10 [&_svg]:text-violet-600 dark:[&_svg]:text-violet-400",
  },
  {
    key: "borrowedBooks" as const,
    title: ru.admin.borrowedBooksStat,
    description: ru.admin.borrowedBooksDesc,
    icon: BookMarked,
    iconClassName: "bg-amber-500/10 [&_svg]:text-amber-600 dark:[&_svg]:text-amber-400",
  },
  {
    key: "availableBooks" as const,
    title: ru.admin.availableBooks,
    description: ru.admin.availableBooksDesc,
    icon: Library,
    iconClassName: "bg-emerald-500/10 [&_svg]:text-emerald-600 dark:[&_svg]:text-emerald-400",
  },
];

export function AdminDashboardContent() {
  const { data, isLoading, isFetching, isError, error, refetch } = useAdminStatistics();

  return (
    <AdminLayout
      title={ru.admin.dashboardTitle}
      description={ru.admin.dashboardSubtitle}
      onRefresh={() => refetch()}
      isRefreshing={isFetching && !isLoading}
    >
      {isError && (
        <ErrorState message={getApiErrorMessage(error)} onRetry={() => refetch()} />
      )}

      {!isError && (
        <div className="space-y-6 md:space-y-8">
          <DashboardGrid columns="stats">
            {isLoading
              ? STAT_CONFIG.map((_, index) => <StatsCardSkeleton key={index} />)
              : STAT_CONFIG.map((config, index) => (
                  <StatsCard
                    key={config.key}
                    title={config.title}
                    value={data?.[config.key] ?? 0}
                    description={config.description}
                    icon={config.icon}
                    iconClassName={config.iconClassName}
                    animationIndex={index}
                  />
                ))}
          </DashboardGrid>

          <LibraryOverviewCharts statistics={data} isLoading={isLoading} />
        </div>
      )}
    </AdminLayout>
  );
}
