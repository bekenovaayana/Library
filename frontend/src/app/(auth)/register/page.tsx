import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";

export default function RegisterPage() {
  return (
    <AuthLayout title="Create account" subtitle="Join the library management system">
      <RegisterForm />
    </AuthLayout>
  );
}
