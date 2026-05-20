import { Suspense } from "react";
import { AuthLayout } from "@/shared/components/layouts/auth-layout";
import { ResetPasswordPageContent } from "@/features/auth/components/reset-password-page-content";
import { Spinner } from "@/shared/components/spinner";

export default function ResetPasswordPage() {
  return (
    <AuthLayout title="Reset password" subtitle="Enter your reset token and a new password">
      <Suspense
        fallback={
          <div className="flex justify-center py-8">
            <Spinner size="lg" />
          </div>
        }
      >
        <ResetPasswordPageContent />
      </Suspense>
    </AuthLayout>
  );
}
