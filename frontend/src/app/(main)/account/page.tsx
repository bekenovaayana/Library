import { ChangePasswordForm } from "@/features/auth/components/change-password-form";

export default function AccountPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Account security</h1>
        <p className="text-sm text-muted-foreground">
          Change your password. You will be signed out on all devices after saving.
        </p>
      </div>
      <ChangePasswordForm />
    </div>
  );
}
