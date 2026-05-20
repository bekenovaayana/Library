"use client";

import type { LucideIcon } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { cn } from "@/shared/lib/utils";

export interface StatsCardProps {
  title: string;
  value: number | string;
  description?: string;
  icon: LucideIcon;
  iconClassName?: string;
  animationIndex?: number;
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  iconClassName,
  animationIndex = 0,
  className,
}: StatsCardProps) {
  return (
    <Card
      className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        "animate-in fade-in slide-in-from-bottom-4 fill-mode-both duration-500",
        className,
      )}
      style={{ animationDelay: `${animationIndex * 75}ms` }}
    >
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">{title}</CardTitle>
        <div
          className={cn(
            "flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10",
            iconClassName,
          )}
        >
          <Icon className="h-4 w-4 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold tracking-tight tabular-nums">{value}</p>
        {description ? (
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        ) : null}
      </CardContent>
    </Card>
  );
}
