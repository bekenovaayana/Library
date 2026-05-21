import type { MetadataRoute } from "next";
import { siteConfig } from "@/shared/lib/seo";
import { ru } from "@/shared/i18n";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: siteConfig.name,
    short_name: ru.app.shortName,
    description: siteConfig.description,
    start_url: "/",
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#18181b",
    orientation: "portrait-primary",
    scope: "/",
    lang: "ru",
    categories: ["books", "education", "productivity"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
