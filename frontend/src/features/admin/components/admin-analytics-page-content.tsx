"use client";

import { useAdminStatistics } from "@/features/admin/hooks/useAdminStatistics";
import { AdminLayout } from "@/features/admin/components/admin-layout";
import { LibraryOverviewCharts } from "@/features/admin/components/library-overview-chart";
import { ErrorState } from "@/shared/components/error-state";
import { getApiErrorMessage } from "@/services/api/apiClient";

export function AdminAnalyticsPageContent() {
  const { data, isLoading, isError, error, refetch } = useAdminStatistics();

  return (
    <AdminLayout
      title="Analytics"
      description="Library usage overview from live statistics"
    >
      {isError && (
        <ErrorState
          error={error}
          message={getApiErrorMessage(error)}
          onRetry={() => refetch()}
        />
      )}

      {!isError && (
        <LibraryOverviewCharts statistics={data} isLoading={isLoading} />
      )}
    </AdminLayout>
  );
}
