import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/lib/seo";
import { ROUTES } from "@/shared/constants/routes";

const publicPaths = [
  ROUTES.HOME,
  ROUTES.LOGIN,
  ROUTES.REGISTER,
  ROUTES.BOOKS,
] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return publicPaths.map((path) => ({
    url: new URL(path, siteConfig.url).toString(),
    lastModified,
    changeFrequency: path === ROUTES.BOOKS ? "daily" : "weekly",
    priority: path === ROUTES.HOME ? 1 : 0.8,
  }));
}
