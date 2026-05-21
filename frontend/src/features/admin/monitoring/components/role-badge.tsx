import { cn } from "@/shared/lib/utils";
import { roleLabel } from "@/shared/i18n";
import type { UserRole } from "@/shared/types/auth";

const styles: Record<UserRole, string> = {
  ADMIN: "bg-violet-500/10 text-violet-700 dark:text-violet-400",
  USER: "bg-blue-500/10 text-blue-700 dark:text-blue-400",
};

export function RoleBadge({ role, className }: { role: UserRole; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2 py-0.5 text-xs font-medium",
        styles[role],
        className,
      )}
    >
      {roleLabel(role)}
    </span>
  );
}
