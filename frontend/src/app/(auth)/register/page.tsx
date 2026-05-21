import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { RegisterForm } from "@/features/auth/components/register-form";
import { ru } from "@/shared/i18n";

export default function RegisterPage() {
  return (
    <AuthLayout title={ru.auth.createAccount} subtitle={ru.auth.registerSubtitle}>
      <RegisterForm />
    </AuthLayout>
  );
}
