import { ChangePasswordForm } from "@/features/auth/components/change-password-form";
import { ProfileForm } from "@/features/profile/components/profile-form";
import { ru } from "@/shared/i18n";

export default function AccountPage() {
  return (
    <div className="mx-auto max-w-2xl space-y-10">
      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{ru.account.profile}</h1>
          <p className="text-sm text-muted-foreground">{ru.account.profileHint}</p>
        </div>
        <ProfileForm />
      </section>

      <section className="space-y-4 border-t pt-10">
        <div>
          <h2 className="text-xl font-semibold tracking-tight">{ru.account.security}</h2>
          <p className="text-sm text-muted-foreground">{ru.account.securityHint}</p>
        </div>
        <ChangePasswordForm />
      </section>
    </div>
  );
}
