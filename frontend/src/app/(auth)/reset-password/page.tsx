import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { ResetPasswordPageContent } from "@/features/auth/components/reset-password-page-content";
import { ru } from "@/shared/i18n";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title={ru.auth.resetTitle} subtitle={ru.auth.resetSubtitle}>
      <ResetPasswordPageContent />
    </AuthLayout>
  );
}
