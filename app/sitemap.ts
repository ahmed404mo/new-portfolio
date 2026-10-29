import type { MetadataRoute } from "next"
import { defaultLocale, locales } from "@/lib/i18n"
import { siteConfig } from "@/lib/site"

const sitemapLanguageAlternates = {
  en: `${siteConfig.url}/en`,
  ar: `${siteConfig.url}/ar`,
  "x-default": `${siteConfig.url}/en`,
}

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date()

  return locales.map((locale) => ({
    url: `${siteConfig.url}/${locale}`,
    lastModified,
    changeFrequency: "weekly",
    priority: 1.0,
    alternates: {
      languages: sitemapLanguageAlternates,
    },
  }))
}
