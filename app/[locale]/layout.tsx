import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { Cairo, Space_Grotesk, Silkscreen, Handjet } from "next/font/google";
import ThemeProvider from "@/components/modules/theme-provider";

const space = Space_Grotesk({ subsets: ["latin"], variable: "--font-space-grotesk" });
const pixel = Silkscreen({ subsets: ["latin"], weight: ["400", "700"], variable: "--font-silkscreen" });
const handjet = Handjet({ subsets: ["arabic"], weight: ["400", "700"], variable: "--font-handjet" });
const cairo = Cairo({ subsets: ["arabic", "latin"], variable: "--font-cairo" });

import "@/styles/globals.css";
import { isLocale, languageAlternates, localeContent, locales } from "@/lib/i18n";
import { buildStructuredData } from "@/lib/seo";
import { siteConfig } from "@/lib/site";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const googleVerification = process.env.GOOGLE_SITE_VERIFICATION?.trim();
const bingVerification = process.env.BING_SITE_VERIFICATION?.trim();

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

type LocaleLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Pick<LocaleLayoutProps, "params">): Promise<Metadata> {
  const { locale: rawLocale } = await params;

  if (!isLocale(rawLocale)) {
    return {};
  }

  const locale = rawLocale;
  const content = localeContent[locale];
  const canonical = `/${locale}`;
  const alternateLocale = locales.filter((item) => item !== locale).map((item) => localeContent[item].ogLocale);

  return {
    metadataBase: new URL(siteConfig.url),

    title: {
      default: content.title,
      template: `%s | ${content.shortTitle}`,
    },

    description: content.description,

    applicationName: content.appName,

    authors: [{ name: siteConfig.name, url: siteConfig.url }],

    creator: siteConfig.name,
    publisher: siteConfig.name,

    category: "technology",

    keywords: [...content.keywords],

    alternates: {
      canonical,
      languages: languageAlternates,
    },

    openGraph: {
      type: "website",
      url: canonical,
      siteName: content.appName,
      title: content.title,
      description: content.shortDescription,
      locale: content.ogLocale,
      alternateLocale,
    },

    twitter: {
      card: "summary_large_image",
      title: content.title,
      description: content.shortDescription,
    },

    icons: {
      icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
      shortcut: "/favicon.svg",
    },

    manifest: "/manifest.webmanifest",

    robots: {
      index: true,
      follow: true,
      noarchive: false,
      nosnippet: false,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    referrer: "origin-when-cross-origin",

    appleWebApp: {
      capable: true,
      title: content.shortTitle,
      statusBarStyle: "black-translucent",
    },

    ...(googleVerification || bingVerification
      ? {
          verification: {
            ...(googleVerification ? { google: googleVerification } : {}),
            ...(bingVerification ? { other: { "msvalidate.01": bingVerification } } : {}),
          },
        }
      : {}),
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  colorScheme: "light dark",
  themeColor: "#0D0709",
};

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!isLocale(locale)) {
    notFound();
  }

  const content = localeContent[locale];
  const structuredData = buildStructuredData(locale);

  return (
    <html
      lang={content.htmlLang}
      dir={content.dir}
      suppressHydrationWarning
      className={` ${space.variable} ${pixel.variable} ${handjet.variable} ${cairo.variable}`}
    >
      <body
        className={`min-h-screen bg-background ${
          content.dir === "rtl" ? "font-arabic" : "font-sans"
        } text-foreground antialiased`}
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData).replace(/</g, "\\u003c"),
          }}
        />
        <ThemeProvider>
          <Navbar locale={locale} />
          <main className="min-h-[calc(100vh-4rem)]">{children}</main>
          <Footer locale={locale} />
        </ThemeProvider>
      </body>
    </html>
  );
}
