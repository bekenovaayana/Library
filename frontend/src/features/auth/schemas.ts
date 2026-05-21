import { z } from "zod";
import { ru } from "@/shared/i18n";

const v = ru.validation;

export const loginSchema = z.object({
  email: z.string().min(1, v.emailRequired).email(v.emailInvalid),
  password: z.string().min(1, v.passwordRequired).min(8, v.passwordMin8),
});

export const registerSchema = z
  .object({
    username: z
      .string()
      .min(1, v.usernameRequired)
      .min(3, v.usernameMin3)
      .max(50, v.usernameMax50),
    email: z.string().min(1, v.emailRequired).email(v.emailInvalid),
    password: z
      .string()
      .min(1, v.passwordRequired)
      .min(8, v.passwordMin8)
      .max(100, v.passwordMax100),
    confirmPassword: z.string().min(1, v.confirmPassword),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: v.passwordsMismatch,
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, v.emailRequired).email(v.emailInvalid),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, v.tokenRequired),
    newPassword: z
      .string()
      .min(1, v.passwordRequired)
      .min(8, v.passwordMin8)
      .max(100, v.passwordMax100),
    confirmPassword: z.string().min(1, v.confirmPassword),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: v.passwordsMismatch,
    path: ["confirmPassword"],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(1, v.currentPasswordRequired)
      .min(8, v.passwordMin8),
    newPassword: z
      .string()
      .min(1, v.newPasswordRequired)
      .min(8, v.passwordMin8)
      .max(100, v.passwordMax100),
    confirmPassword: z.string().min(1, v.confirmPassword),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: v.passwordsMismatch,
    path: ["confirmPassword"],
  })
  .refine((data) => data.currentPassword !== data.newPassword, {
    message: v.newPasswordDifferent,
    path: ["newPassword"],
  });

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;
