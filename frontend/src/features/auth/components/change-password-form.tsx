"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  changePasswordSchema,
  type ChangePasswordFormValues,
} from "@/features/auth/schemas";
import { useChangePassword } from "@/features/auth/hooks/useChangePassword";
import { FormField } from "@/features/auth/components/form-field";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { Spinner } from "@/shared/components/spinner";

export function ChangePasswordForm() {
  const mutation = useChangePassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  return (
    <form
      onSubmit={handleSubmit((values) => mutation.mutate(values))}
      className="mx-auto max-w-md space-y-4"
      noValidate
    >
      <FormField
        label="Current password"
        htmlFor="currentPassword"
        error={errors.currentPassword?.message}
      >
        <Input
          id="currentPassword"
          type="password"
          autoComplete="current-password"
          disabled={mutation.isPending}
          aria-invalid={Boolean(errors.currentPassword)}
          {...register("currentPassword")}
        />
      </FormField>

      <FormField label="New password" htmlFor="newPassword" error={errors.newPassword?.message}>
        <Input
          id="newPassword"
          type="password"
          autoComplete="new-password"
          disabled={mutation.isPending}
          aria-invalid={Boolean(errors.newPassword)}
          {...register("newPassword")}
        />
      </FormField>

      <FormField
        label="Confirm new password"
        htmlFor="confirmPassword"
        error={errors.confirmPassword?.message}
      >
        <Input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          disabled={mutation.isPending}
          aria-invalid={Boolean(errors.confirmPassword)}
          {...register("confirmPassword")}
        />
      </FormField>

      <Button type="submit" disabled={mutation.isPending}>
        {mutation.isPending ? (
          <>
            <Spinner size="sm" className="text-primary-foreground" />
            Saving...
          </>
        ) : (
          "Change password"
        )}
      </Button>
    </form>
  );
}
