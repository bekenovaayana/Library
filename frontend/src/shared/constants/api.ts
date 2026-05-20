import { env } from "@/shared/config/env";

/** Base URL for REST API (includes /api path). */
export const API_BASE_URL = env.apiUrl;

export const AUTH_TOKEN_KEY = "library_auth_token";
export const AUTH_REFRESH_KEY = "library_auth_refresh_token";
export const AUTH_COOKIE = "library_auth_token";
export const AUTH_ROLE_COOKIE = "library_user_role";
