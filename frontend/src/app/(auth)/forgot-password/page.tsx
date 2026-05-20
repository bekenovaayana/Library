import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { ForgotPasswordForm } from "@/features/auth/components/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <AuthLayout title="Forgot password" subtitle="We'll send reset instructions if the email exists">
      <ForgotPasswordForm />
    </AuthLayout>
  );
}
