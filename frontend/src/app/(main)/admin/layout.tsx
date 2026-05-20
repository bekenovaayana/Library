import { RoleGuard } from "@/shared/components/auth/role-guard";

export default function AdminRouteLayout({ children }: { children: React.ReactNode }) {
  return <RoleGuard roles={["ADMIN"]}>{children}</RoleGuard>;
}
