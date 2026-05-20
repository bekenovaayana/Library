export type UserRole = "USER" | "ADMIN";

export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  role: UserRole;
  username: string;
}

export interface ForgotPasswordResponse {
  message: string;
  resetToken?: string;
}

export interface MessageResponse {
  message: string;
}
