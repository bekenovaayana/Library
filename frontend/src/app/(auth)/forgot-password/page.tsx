import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";
import { ru } from "@/shared/i18n";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title={ru.auth.forgotTitle} subtitle={ru.auth.forgotSubtitle}>
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
