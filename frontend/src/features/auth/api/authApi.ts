import { apiClient } from "@/services/api";
import type {
  AuthResponse,
  ForgotPasswordResponse,
  MessageResponse,
} from "@/shared/types/auth";
import type { LoginFormValues, RegisterFormValues } from "@/features/auth/schemas";
import type { ForgotPasswordFormValues, ResetPasswordFormValues } from "@/features/auth/schemas";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
}

export const authApi = {
  login: async (payload: LoginFormValues): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/login", {
      email: payload.email,
      password: payload.password,
    } satisfies LoginPayload);
    return data;
  },

  register: async (payload: RegisterFormValues): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/register", {
      username: payload.username,
      email: payload.email,
      password: payload.password,
    } satisfies RegisterPayload);
    return data;
  },

  refresh: async (refreshToken: string): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>("/auth/refresh", { refreshToken });
    return data;
  },

  logout: async (refreshToken: string | null): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>("/auth/logout", {
      refreshToken: refreshToken ?? undefined,
    });
    return data;
  },

  changePassword: async (payload: {
    currentPassword: string;
    newPassword: string;
  }): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>("/auth/change-password", payload);
    return data;
  },

  forgotPassword: async (payload: ForgotPasswordFormValues): Promise<ForgotPasswordResponse> => {
    const { data } = await apiClient.post<ForgotPasswordResponse>("/auth/forgot-password", payload);
    return data;
  },

  resetPassword: async (payload: ResetPasswordFormValues): Promise<MessageResponse> => {
    const { data } = await apiClient.post<MessageResponse>("/auth/reset-password", {
      token: payload.token,
      newPassword: payload.newPassword,
    });
    return data;
  },
};
