import { cookies } from "next/headers";
import { API_BASE_URL, AUTH_COOKIE } from "@/shared/constants/api";

/** Node fetch requires an absolute URL; relative `/api` only works in the browser. */
function resolveServerApiUrl(path: string): string {
  const base = API_BASE_URL.replace(/\/$/, "");
  const apiPath = path.startsWith("/") ? path : `/${path}`;

  if (/^https?:\/\//i.test(base)) {
    return `${base}${apiPath}`;
  }

  const proxyTarget = (process.env.API_PROXY_TARGET ?? "http://localhost:8080").replace(
    /\/$/,
    "",
  );
  const prefix = base.startsWith("/") ? base : `/${base}`;
  return `${proxyTarget}${prefix}${apiPath}`;
}

export class ServerApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ServerApiError";
  }
}

export async function serverFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const cookieStore = await cookies();
  const token = cookieStore.get(AUTH_COOKIE)?.value;

  const response = await fetch(resolveServerApiUrl(path), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...init?.headers,
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw new ServerApiError(
      `Request failed: ${response.status} ${response.statusText}`,
      response.status,
    );
  }

  return response.json() as Promise<T>;
}
