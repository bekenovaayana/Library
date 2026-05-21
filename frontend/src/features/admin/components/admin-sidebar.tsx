"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowLeft, Library, Shield, X } from "lucide-react";
import { ADMIN_NAV_ITEMS } from "@/features/admin/constants/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/ui/button";
import { ru } from "@/shared/i18n";

interface AdminSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r bg-card transition-transform duration-200 lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full lg:translate-x-0",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4">
          <div className="flex items-center gap-2 font-semibold">
            <Shield className="h-5 w-5 text-primary" />
            <span>{ru.nav.admin}</span>
          </div>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {ADMIN_NAV_ITEMS.map(({ href, label, icon: Icon, disabled }) => {
            const isActive =
              href === ROUTES.ADMIN
                ? pathname === ROUTES.ADMIN
                : pathname === href || pathname.startsWith(`${href}/`);

            if (disabled) {
              return (
                <span
                  key={href}
                  className="flex cursor-not-allowed items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground/50"
                  title={ru.common.comingSoon}
                >
                  <Icon className="h-4 w-4" />
                  {label}
                  <span className="ml-auto text-xs">{ru.common.soon}</span>
                </span>
              );
            }

            return (
              <Link
                key={href}
                href={href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t p-4">
          <Link
            href={ROUTES.DASHBOARD}
            onClick={onClose}
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            {ru.nav.backToApp}
          </Link>
          <div className="mt-3 flex items-center gap-2 px-3 text-xs text-muted-foreground">
            <Library className="h-3.5 w-3.5" />
            {ru.nav.libraryManagement}
          </div>
        </div>
      </aside>
    </>
  );
}
