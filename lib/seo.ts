import type { Metadata, MetadataRoute } from "next"
import { content } from "./content"
import { localeContent, locales, type Locale } from "./i18n"
import { siteConfig } from "./site"

export const OG_IMAGE_SIZE = {
  width: 1200,
  height: 630,
}

export const OG_IMAGE_CONTENT_TYPE = "image/png"

export const OG_IMAGE_ALT = `${siteConfig.name} — Full Stack Software Engineer | أحمد مختار — مهندس برمجيات`

export function absoluteUrl(path = "") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`
}

export function buildPageMetadata({
  locale,
  title,
  description,
  path = "",
  type = "website",
}: {
  locale: Locale
  title: string
  description: string
  path?: string
  type?: "website" | "profile" | "article"
}): Metadata {
  const languages = Object.fromEntries(
    locales.map((item) => [item, absoluteUrl(`/${item}${path}`)]),
  )

  return {
    title,
    description,
    alternates: {
      canonical: absoluteUrl(`/${locale}${path}`),
      languages: {
        ...languages,
        "x-default": absoluteUrl(`/en${path}`),
      },
    },
    openGraph: {
      type,
      url: absoluteUrl(`/${locale}${path}`),
      siteName: localeContent[locale].appName,
      title,
      description,
      locale: localeContent[locale].ogLocale,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
    robots: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  }
}

export function buildStructuredData(locale: Locale) {
  const pageContent = localeContent[locale]
  const siteContent = content[locale]
  const personId = `${siteConfig.url}/#person`
  const websiteId = `${siteConfig.url}/#website`
  const profilePageId = `${siteConfig.url}/${locale}/#profilepage`
  const faqId = `${siteConfig.url}/${locale}/#faq`
  const avatarId = `${siteConfig.url}/#avatar`

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": websiteId,
        url: siteConfig.url,
        name: pageContent.appName,
        alternateName: [
          "Ahmed Mokhtar Portfolio",
          "معرض أعمال أحمد مختار",
          "باندا",
          "Panda",
          "panda",
          "Ahmed Mokhtar",
        ],
        description: pageContent.description,
        inLanguage: locale,
        publisher: { "@id": personId },
        copyrightHolder: { "@id": personId },
      },
      {
        "@type": "Person",
        "@id": personId,
        name: siteConfig.name,
        givenName: "Ahmed",
        familyName: "Mokhtar",
        alternateName: [...siteConfig.alternateNames],
        url: siteConfig.url,
        image: { "@id": avatarId },
        jobTitle: pageContent.jobTitle,
        description: pageContent.description,
        disambiguatingDescription:
          locale === "ar"
            ? "أحمد مختار (باندا / ahmed404mo) هو مهندس برمجيات Full Stack من مصر متخصص في MERN Stack وNext.js."
            : "Ahmed Mokhtar (Panda / ahmed404mo) is a Full Stack Software Engineer based in Egypt specializing in MERN Stack and Next.js.",
        gender: "https://schema.org/Male",
        email: `mailto:${siteConfig.email}`,
        telephone: siteConfig.phone,
        nationality: { "@type": "Country", name: siteConfig.location.countryName },
        knowsLanguage: ["ar", "en"],
        address: {
          "@type": "PostalAddress",
          addressLocality: siteConfig.location.city,
          addressRegion: siteConfig.location.region,
          addressCountry: siteConfig.location.country,
        },
        homeLocation: {
          "@type": "Place",
          name: `${siteConfig.location.city}, ${siteConfig.location.countryName}`,
        },
        contactPoint: {
          "@type": "ContactPoint",
          contactType: "professional",
          email: siteConfig.email,
          telephone: siteConfig.phone,
          availableLanguage: ["Arabic", "English"],
        },
        sameAs: [
          ...Object.values(siteConfig.socials),
          "https://github.com/ahmed404mo",
          siteConfig.cv,
        ],
        knowsAbout: [...pageContent.knowsAbout],
        hasOccupation: {
          "@type": "Occupation",
          name: pageContent.jobTitle,
          occupationLocation: {
            "@type": "Country",
            name: siteConfig.location.countryName,
          },
          skills: pageContent.knowsAbout.join(", "),
        },
        mainEntityOfPage: { "@id": profilePageId },
      },
      {
        "@type": "ImageObject",
        "@id": avatarId,
        url: siteConfig.avatar,
        contentUrl: siteConfig.avatar,
        name: `${siteConfig.name} — ${pageContent.jobTitle}`,
        caption: siteConfig.name,
      },
      {
        "@type": "ProfilePage",
        "@id": profilePageId,
        url: absoluteUrl(`/${locale}`),
        name: pageContent.title,
        description: pageContent.description,
        inLanguage: locale,
        dateModified: new Date().toISOString(),
        about: { "@id": personId },
        mainEntity: { "@id": personId },
        isPartOf: { "@id": websiteId },
        breadcrumb: {
          "@type": "BreadcrumbList",
          itemListElement: [
            {
              "@type": "ListItem",
              position: 1,
              name: siteContent.nav.home,
              item: absoluteUrl(`/${locale}`),
            },
          ],
        },
      },
      {
        "@type": "FAQPage",
        "@id": faqId,
        inLanguage: locale,
        mainEntity: siteContent.faq.items.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: item.answer,
          },
        })),
      },
    ],
  }
}

export function buildBreadcrumbSchema(
  locale: Locale,
  items: readonly { name: string; path: string }[],
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: content[locale].nav.home,
        item: absoluteUrl(`/${locale}`),
      },
      ...items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: item.name,
        item: absoluteUrl(`/${locale}${item.path}`),
      })),
    ],
  }
}

export function buildManifest(): MetadataRoute.Manifest {
  const en = localeContent.en
  const ar = localeContent.ar

  return {
    name: `${en.appName} | ${ar.appName}`,
    short_name: siteConfig.name,
    description: `${en.shortDescription} ${ar.shortDescription}`,
    start_url: "/en",
    scope: "/",
    display: "standalone",
    orientation: "portrait-primary",
    background_color: "#0D0709",
    theme_color: "#0D0709",
    lang: "en",
    dir: "ltr",
    categories: ["portfolio", "technology", "developer"],
    icons: [
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
      {
        src: "/favicon.svg",
        sizes: "any",
        type: "image/svg+xml",
        purpose: "maskable",
      },
    ],
  }
}
