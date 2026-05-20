import Link from "next/link";
import { BookOpen } from "lucide-react";
import { ROUTES } from "@/shared/constants/routes";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <div className="mb-8 flex flex-col items-center gap-2 text-center">
        <Link href={ROUTES.HOME} className="flex items-center gap-2 text-xl font-bold">
          <BookOpen className="h-6 w-6" />
          Library Management
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground">{subtitle}</p>}
      </div>

      <div className="w-full max-w-md rounded-lg border bg-card p-6 shadow-sm">{children}</div>
    </div>
  );
}
