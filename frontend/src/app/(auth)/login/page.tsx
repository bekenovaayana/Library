import { Suspense } from "react";
import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { LoginForm } from "@/features/auth/components/login-form";
import { Spinner } from "@/shared/components/spinner";
import { ru } from "@/shared/i18n";

export default function LoginPage() {
  return (
    <AuthLayout title={ru.auth.welcomeBack} subtitle={ru.auth.signInSubtitle}>
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        }
      >
        <LoginForm />
      </Suspense>
    </AuthLayout>
  );
}
