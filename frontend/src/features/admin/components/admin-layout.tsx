"use client";

import { useState } from "react";
import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import { AdminHeader } from "@/features/admin/components/admin-header";

interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  description?: string;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export function AdminLayout({
  children,
  title = "Dashboard",
  description = "System overview and library statistics",
  onRefresh,
  isRefreshing,
}: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="-m-4 flex min-h-[calc(100vh-3.5rem)] flex-col md:-m-6 lg:-m-8 md:min-h-[calc(100vh-3.5rem)]">
      <div className="flex flex-1">
        <AdminSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex min-w-0 flex-1 flex-col">
          <div className="border-b px-4 py-4 md:px-6 lg:px-8">
            <AdminHeader
              title={title}
              description={description}
              onMenuClick={() => setSidebarOpen(true)}
              onRefresh={onRefresh}
              isRefreshing={isRefreshing}
            />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 lg:px-8">{children}</div>
        </div>
      </div>
    </div>
  );
}
