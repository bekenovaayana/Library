import { BarChart3, BookMarked, BookOpen, LayoutDashboard, Users } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import { ru } from "@/shared/i18n";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: ROUTES.ADMIN, label: ru.admin.dashboard, icon: LayoutDashboard },
  { href: ROUTES.ADMIN_BOOKS, label: ru.admin.books, icon: BookOpen },
  { href: ROUTES.ADMIN_USERS, label: ru.admin.users, icon: Users },
  { href: ROUTES.ADMIN_BORROWED_BOOKS, label: ru.admin.borrowedBooks, icon: BookMarked },
  { href: ROUTES.ADMIN_ANALYTICS, label: ru.admin.analytics, icon: BarChart3 },
];
