"use client";

import { Menu, RefreshCw } from "lucide-react";
import { Button } from "@/shared/ui/button";
import { Spinner } from "@/shared/components/spinner";
import { ru } from "@/shared/i18n";

interface AdminHeaderProps {
  title: string;
  description?: string;
  onMenuClick?: () => void;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminHeader({
  title,
  description,
  onMenuClick,
  onRefresh,
  isRefreshing = false,
}: AdminHeaderProps) {
  return (
    <header className="flex flex-col gap-4 border-b bg-background/95 pb-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        {onMenuClick ? (
          <Button
            variant="outline"
            size="icon"
            className="shrink-0 lg:hidden"
            onClick={onMenuClick}
            aria-label={ru.admin.openAdminMenu}
          >
            <Menu className="h-5 w-5" />
          </Button>
        ) : null}
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">{title}</h1>
          {description ? <p className="text-sm text-muted-foreground md:text-base">{description}</p> : null}
        </div>
      </div>

      {onRefresh ? (
        <Button
          variant="outline"
          size="sm"
          onClick={onRefresh}
          disabled={isRefreshing}
          className="shrink-0 self-start sm:self-center"
        >
          {isRefreshing ? (
            <Spinner size="sm" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {ru.common.refresh}
        </Button>
      ) : null}
    </header>
  );
}
