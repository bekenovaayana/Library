"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/features/auth/schemas";
import { useResetPassword } from "@/features/auth/hooks/useResetPassword";
import { FormField } from "@/features/auth/components/form-field";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Spinner } from "@/shared/components/spinner";
import { ROUTES } from "@/shared/constants/routes";

interface ResetPasswordFormProps {
  initialToken?: string;
}

export function ResetPasswordForm({ initialToken = "" }: ResetPasswordFormProps) {
  const mutation = useResetPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: initialToken,
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <>
      <form onSubmit={handleSubmit((values) => mutation.mutate(values))} className="space-y-4" noValidate>
        <FormField label="Reset token" htmlFor="token" error={errors.token?.message}>
          <Input
            id="token"
            type="text"
            placeholder="Paste token from email"
            disabled={mutation.isPending}
            aria-invalid={Boolean(errors.token)}
            {...register("token")}
          />
        </FormField>

        <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
          <PasswordInput
            id="newPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={mutation.isPending}
            aria-invalid={Boolean(errors.newPassword)}
            {...register("newPassword")}
          />
        </FormField>

        <FormField
          label="Confirm password"
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={mutation.isPending}
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={mutation.isPending}>
          {mutation.isPending ? (
            <>
              <Spinner size="sm" className="text-primary-foreground" />
              Updating...
            </>
          ) : (
            "Reset password"
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        <Link href={ROUTES.LOGIN} className="font-medium text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </>
  );
}
