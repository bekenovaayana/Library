"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginFormValues } from "@/features/auth/schemas";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { FormField } from "@/features/auth/components/form-field";
import { Button } from "@/shared/ui/button";
import { Input } from "@/shared/ui/input";
import { PasswordInput } from "@/shared/ui/password-input";
import { Spinner } from "@/shared/components/spinner";
import { ROUTES } from "@/shared/constants/routes";
import { ru } from "@/shared/i18n";

export function LoginForm() {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <FormField label={ru.auth.email} htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder={ru.auth.emailPlaceholder}
            autoComplete="email"
            disabled={loginMutation.isPending}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>

        <FormField label={ru.auth.password} htmlFor="password" error={errors.password?.message}>
          <div className="space-y-1">
            <PasswordInput
              id="password"
              placeholder={ru.auth.passwordPlaceholder}
              autoComplete="current-password"
              disabled={loginMutation.isPending}
              aria-invalid={Boolean(errors.password)}
              {...register("password")}
            />
            <p className="text-right text-xs">
              <Link
                href={ROUTES.FORGOT_PASSWORD}
                className="text-primary hover:underline"
                tabIndex={loginMutation.isPending ? -1 : 0}
              >
                {ru.auth.forgotPassword}
              </Link>
            </p>
          </div>
        </FormField>

        <Button type="submit" className="w-full" disabled={loginMutation.isPending}>
          {loginMutation.isPending ? (
            <>
              <Spinner size="sm" className="text-primary-foreground" />
              {ru.auth.signingIn}
            </>
          ) : (
            ru.auth.signIn
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        {ru.auth.noAccount}{" "}
        <Link
          href={ROUTES.REGISTER}
          className="font-medium text-primary hover:underline"
          tabIndex={loginMutation.isPending ? -1 : 0}
        >
          {ru.auth.register}
        </Link>
      </p>
    </>
  );
}
