"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Menu, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/shared/ui/button";
import { ROUTES } from "@/shared/constants/routes";
import { useLogout } from "@/features/auth/hooks/useLogout";
import { useAuthStore } from "@/store";
import { useUiStore } from "@/store/uiStore";
import { roleLabel, ru } from "@/shared/i18n";

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAuthStore();
  const { logout } = useLogout();
  const { toggleSidebar } = useUiStore();
  const isAdminSection = pathname === ROUTES.ADMIN || pathname.startsWith(`${ROUTES.ADMIN}/`);

  return (
    <header className="sticky top-0 z-40 flex h-14 items-center gap-4 border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 lg:px-6">
      {!isAdminSection && (
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={toggleSidebar}
          aria-label={ru.nav.toggleSidebar}
        >
          <Menu className="h-5 w-5" />
        </Button>
      )}

      <Link href={ROUTES.DASHBOARD} className="flex items-center gap-2 font-semibold">
        <BookOpen className="h-5 w-5" />
        <span className="hidden sm:inline">{ru.nav.library}</span>
      </Link>

      <div className="ml-auto flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          className="relative"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label={ru.nav.toggleTheme}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>

        {isAuthenticated ? (
          <>
            <div className="hidden min-w-0 flex-col items-end text-right sm:flex">
              <span className="max-w-[8rem] truncate text-sm font-medium sm:max-w-[12rem]">
                {user?.username}
              </span>
              <span className="text-xs text-muted-foreground">
                {user?.role ? roleLabel(user.role) : ""}
              </span>
            </div>
            <Button variant="outline" size="sm" onClick={logout} className="shrink-0">
              <span className="hidden xs:inline">{ru.nav.logout}</span>
              <span className="xs:hidden">{ru.nav.exit}</span>
            </Button>
          </>
        ) : (
          <Button asChild size="sm">
            <Link href={ROUTES.LOGIN}>{ru.nav.login}</Link>
          </Button>
        )}
      </div>
    </header>
  );
}
