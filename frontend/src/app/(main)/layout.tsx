import { ProtectedLayout } from "@/features/auth/components/protected-layout";

export default function MainGroupLayout({ children }: { children: React.ReactNode }) {
  return <ProtectedLayout>{children}</ProtectedLayout>;
}
