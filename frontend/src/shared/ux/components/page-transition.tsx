"use client";

import { usePathname } from "next/navigation";
import { cn } from "@/shared/lib/utils";

interface PageTransitionProps {
  children: React.ReactNode;
  className?: string;
}

export function PageTransition({ children, className }: PageTransitionProps) {
  const pathname = usePathname();

  return (
    <div
      key={pathname}
      className={cn("animate-in fade-in slide-in-from-bottom-2 duration-300 fill-mode-both", className)}
    >
      {children}
    </div>
  );
}
