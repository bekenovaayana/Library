"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterFormValues } from "@/features/auth/schemas";
import { useRegister } from "@/features/auth/hooks/useRegister";
import { FormField } from "@/features/auth/components/form-field";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Spinner } from "@/shared/components/spinner";
import { ROUTES } from "@/shared/constants/routes";
import { ru } from "@/shared/i18n";

export function RegisterForm() {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = (values: RegisterFormValues) => {
    registerMutation.mutate(values);
  };

  const isPending = registerMutation.isPending;

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={ru.auth.username} htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            placeholder={ru.auth.usernamePlaceholder}
            autoComplete="username"
            disabled={isPending}
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />
        </FormField>

        <FormField label={ru.auth.email} htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder={ru.auth.emailPlaceholder}
            autoComplete="email"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>

        <FormField label={ru.auth.password} htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            placeholder={ru.auth.passwordPlaceholder}
            autoComplete="new-password"
            disabled={isPending}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
          />
        </FormField>

        <FormField
          label={ru.auth.confirmPassword}
          htmlFor="confirmPassword"
          error={errors.confirmPassword?.message}
        >
          <PasswordInput
            id="confirmPassword"
            placeholder={ru.auth.passwordPlaceholder}
            autoComplete="new-password"
            disabled={isPending}
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner size="sm" className="text-primary-foreground" />
              {ru.auth.creatingAccount}
            </>
          ) : (
            ru.auth.createAccount
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {ru.auth.hasAccount}{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary hover:underline"
          tabIndex={isPending ? -1 : 0}
        >
          {ru.auth.signIn}
        </Link>
      </p>
    </>
  );
}
