"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/shared/ui/card";
import { LoadingSkeleton } from "@/shared/components/loading-skeleton";
import { cn } from "@/shared/lib/utils";
import type { AdminStatistics } from "@/features/admin/types/admin-statistics";

const BAR_COLORS = ["hsl(221 83% 53%)", "hsl(262 83% 58%)", "hsl(25 95% 53%)", "hsl(142 71% 45%)"];
const PIE_COLORS = ["hsl(25 95% 53%)", "hsl(142 71% 45%)"];

interface LibraryOverviewChartProps {
  statistics?: AdminStatistics;
  isLoading?: boolean;
  className?: string;
}

function buildBarData(stats: AdminStatistics) {
  return [
    { name: "Users", value: stats.totalUsers },
    { name: "Books", value: stats.totalBooks },
    { name: "Borrowed", value: stats.borrowedBooks },
    { name: "Available", value: stats.availableBooks },
  ];
}

function buildPieData(stats: AdminStatistics) {
  return [
    { name: "Borrowed", value: stats.borrowedBooks },
    { name: "Available", value: stats.availableBooks },
  ];
}

function ChartSkeleton() {
  return (
    <Card>
      <CardHeader>
        <LoadingSkeleton className="h-5 w-40" />
        <LoadingSkeleton className="h-4 w-56" />
      </CardHeader>
      <CardContent>
        <LoadingSkeleton className="h-[280px] w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}

export function LibraryOverviewCharts({
  statistics,
  isLoading,
  className,
}: LibraryOverviewChartProps) {
  if (isLoading || !statistics) {
    return (
      <div className={cn("grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6", className)}>
        <ChartSkeleton />
        <ChartSkeleton />
      </div>
    );
  }

  const barData = buildBarData(statistics);
  const pieData = buildPieData(statistics);

  return (
    <div
      className={cn(
        "grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6",
        "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500",
        className,
      )}
      style={{ animationDelay: "300ms" }}
    >
      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Overview</CardTitle>
          <CardDescription>Counts across users and books</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                {barData.map((_, index) => (
                  <Cell key={`bar-${index}`} fill={BAR_COLORS[index % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="text-base">Book availability</CardTitle>
          <CardDescription>Borrowed vs available copies</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={2}
              >
                {pieData.map((_, index) => (
                  <Cell key={`pie-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  borderRadius: "8px",
                  border: "1px solid hsl(var(--border))",
                  background: "hsl(var(--card))",
                }}
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
}
