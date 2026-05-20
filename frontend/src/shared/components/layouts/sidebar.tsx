"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookMarked,
  BookOpen,
  LayoutDashboard,
  Library,
  Shield,
  UserCircle,
  X,
} from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { ROUTES } from "@/shared/constants/routes";
import { useAuthStore } from "@/store";
import { useUiStore } from "@/store/uiStore";
import { Button } from "@/shared/ui/button";

const navItems = [
  { href: ROUTES.DASHBOARD, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.BOOKS, label: "Books", icon: BookOpen },
  { href: ROUTES.MY_BOOKS, label: "My Books", icon: BookMarked },
  { href: ROUTES.ACCOUNT, label: "Account", icon: UserCircle },
];

const adminNavItem = { href: ROUTES.ADMIN, label: "Admin", icon: Shield };

export function Sidebar() {
  const pathname = usePathname();
  const { sidebarOpen, setSidebarOpen } = useUiStore();
  const { user } = useAuthStore();

  const items = user?.role === "ADMIN" ? [...navItems, adminNavItem] : navItems;

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
          aria-hidden
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(100vw-3rem,17rem)] flex-col border-r bg-background shadow-xl transition-transform duration-200 sm:w-64 lg:static lg:translate-x-0 lg:shadow-none",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between border-b px-4 lg:hidden">
          <div className="flex items-center gap-2 font-semibold">
            <Library className="h-5 w-5" />
            Menu
          </div>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {items.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href || pathname.startsWith(`${href}/`);

            return (
              <Link
                key={href}
                href={href}
                onClick={() => setSidebarOpen(false)}
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
      </aside>
    </>
  );
}
