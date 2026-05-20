import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { ProfileForm } from "@/features/profile/components/profile-form";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Profile</h1>
          <p className="text-sm text-muted-foreground">
            Update your username and email address.
          </p>
        </div>
        <ProfileForm />
      </section>

      <section className="space-y-4 border-t pt-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">Security</h2>
          <p className="text-sm text-muted-foreground">
            Change your password. You will be signed out on all devices after saving.
          </p>
        </div>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
