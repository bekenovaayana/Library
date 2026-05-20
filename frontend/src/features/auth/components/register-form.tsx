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
        <FormField label="Username" htmlFor="username" error={errors.username?.message}>
          <Input
            id="username"
            placeholder="johndoe"
            autoComplete="username"
            disabled={isPending}
            aria-invalid={Boolean(errors.username)}
            {...register("username")}
          />
        </FormField>

        <FormField label="Email" htmlFor="email" error={errors.email?.message}>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isPending}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </FormField>

        <FormField label="Password" htmlFor="password" error={errors.password?.message}>
          <PasswordInput
            id="password"
            placeholder="••••••••"
            autoComplete="new-password"
            disabled={isPending}
            aria-invalid={Boolean(errors.password)}
            {...register("password")}
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
            disabled={isPending}
            aria-invalid={Boolean(errors.confirmPassword)}
            {...register("confirmPassword")}
          />
        </FormField>

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? (
            <>
              <Spinner size="sm" className="text-primary-foreground" />
              Creating account...
            </>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      <p className="mt-4 text-center text-sm text-muted-foreground">
        Already have an account?{" "}
        <Link
          href={ROUTES.LOGIN}
          className="font-medium text-primary hover:underline"
          tabIndex={isPending ? -1 : 0}
        >
          Sign in
        </Link>
      </p>
    </>
  );
}
