/**
 * Centralized public environment configuration.
 * Only NEXT_PUBLIC_* variables are available in the browser bundle.
 */
function readEnv(name: string, fallback: string): string {
  const value = process.env[name]?.trim();
  return value && value.length > 0 ? value : fallback;
}

/** Relative URL uses Next.js dev proxy (see next.config.ts rewrites). */
const defaultApiUrl = "/api";
const defaultAppName = "Library Management System";
const defaultAppUrl = "http://localhost:3000";

export const env = {
  apiUrl: readEnv("NEXT_PUBLIC_API_URL", defaultApiUrl),
  appName: readEnv("NEXT_PUBLIC_APP_NAME", defaultAppName),
  appUrl: readEnv("NEXT_PUBLIC_APP_URL", defaultAppUrl),
  pwaEnabled: readEnv("NEXT_PUBLIC_PWA_ENABLED", "false") === "true",
} as const;

export type AppEnv = typeof env;
