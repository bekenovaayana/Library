import type { Metadata, Viewport } from "next";
import { env } from "@/shared/config/env";
import { ru } from "@/shared/i18n";

export const siteConfig = {
  name: env.appName,
  description: ru.app.description,
  url: env.appUrl,
  ogImage: `${env.appUrl}/og-image.svg`,
  locale: "ru_RU",
  twitterHandle: "@libraryapp",
} as const;

export const defaultViewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#09090b" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export function createMetadata(overrides?: Metadata): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    title: {
      default: siteConfig.name,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    applicationName: siteConfig.name,
    keywords: [...ru.app.keywords],
    authors: [{ name: siteConfig.name }],
    creator: siteConfig.name,
    openGraph: {
      type: "website",
      locale: siteConfig.locale,
      url: siteConfig.url,
      siteName: siteConfig.name,
      title: siteConfig.name,
      description: siteConfig.description,
      images: [
        {
          url: siteConfig.ogImage,
          width: 1200,
          height: 630,
          alt: siteConfig.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.name,
      description: siteConfig.description,
      images: [siteConfig.ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      apple: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    },
    manifest: "/manifest.webmanifest",
    ...overrides,
  };
}

export function createPageMetadata(
  title: string,
  description?: string,
  path?: string,
): Metadata {
  const url = path ? new URL(path, siteConfig.url).toString() : siteConfig.url;

  return createMetadata({
    title,
    description: description ?? siteConfig.description,
    openGraph: {
      title,
      description: description ?? siteConfig.description,
      url,
    },
    alternates: {
      canonical: url,
    },
  });
}
