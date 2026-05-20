import { BarChart3, BookMarked, BookOpen, LayoutDashboard, Users } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";
import type { LucideIcon } from "lucide-react";

export interface AdminNavItem {
  href: string;
  label: string;
  icon: LucideIcon;
  disabled?: boolean;
}

export const ADMIN_NAV_ITEMS: AdminNavItem[] = [
  { href: ROUTES.ADMIN, label: "Dashboard", icon: LayoutDashboard },
  { href: ROUTES.ADMIN_BOOKS, label: "Books", icon: BookOpen },
  { href: ROUTES.ADMIN_USERS, label: "Users", icon: Users },
  { href: ROUTES.ADMIN_BORROWED_BOOKS, label: "Borrowed Books", icon: BookMarked },
  { href: ROUTES.ADMIN_ANALYTICS, label: "Analytics", icon: BarChart3 },
];
