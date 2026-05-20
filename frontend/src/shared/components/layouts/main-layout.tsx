"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import { Sidebar } from "./sidebar";
import { ROUTES } from "@/shared/constants/routes";
import { PageTransition } from "@/shared/ux/components/page-transition";

interface MainLayoutProps {
  children: React.ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
  const pathname = usePathname();
  const isAdminSection = pathname === ROUTES.ADMIN || pathname.startsWith(`${ROUTES.ADMIN}/`);

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <div className="flex flex-1">
        {!isAdminSection && <Sidebar />}
        <main
          className={
            isAdminSection
              ? "min-w-0 flex-1 overflow-y-auto overflow-x-hidden"
              : "min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-5 md:p-6 lg:p-8"
          }
        >
          <PageTransition>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
}