export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  ACCOUNT: "/account",
  DASHBOARD: "/dashboard",
  BOOKS: "/books",
  MY_BOOKS: "/my-books",
  ADMIN: "/admin",
  ADMIN_BOOKS: "/admin/books",
  ADMIN_USERS: "/admin/users",
  ADMIN_BORROWED_BOOKS: "/admin/borrowed-books",
  ADMIN_ANALYTICS: "/admin/analytics",
} as const;

export const PUBLIC_ROUTES = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

export const PROTECTED_ROUTES = [
  ROUTES.DASHBOARD,
  ROUTES.BOOKS,
  ROUTES.MY_BOOKS,
  ROUTES.ACCOUNT,
  ROUTES.ADMIN,
] as const;

export const ROLE_PROTECTED_ROUTES = {
  ADMIN: [ROUTES.ADMIN],
} as const;

export const AUTH_ROUTES = [
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.FORGOT_PASSWORD,
  ROUTES.RESET_PASSWORD,
] as const;

export function bookDetailRoute(id: number | string): string {
  return `${ROUTES.BOOKS}/${id}`;
}
