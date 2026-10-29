import type { MetadataRoute } from "next"
import { siteConfig } from "@/lib/site"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login"],
      },
      {
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Bingbot",
          "Applebot",
          "DuckDuckBot",
          "YandexBot",
          "LinkedInBot",
          "Twitterbot",
          "facebookexternalhit",
          "WhatsApp",
          "TelegramBot",
        ],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login"],
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "PerplexityBot",
          "ClaudeBot",
          "anthropic-ai",
          "Google-Extended",
          "cohere-ai",
        ],
        allow: "/",
        disallow: ["/api/", "/dashboard/", "/login"],
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  }
}
