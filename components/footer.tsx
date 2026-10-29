import Link from "next/link";
import { Facebook, Github, Linkedin, Mail } from "lucide-react";
import { content } from "@/lib/content";
import type { SocialLink } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import {
  LOGO_DOT_COLOR,
  LOGO_DOT_PATH,
  LOGO_PATH,
  LOGO_VIEWBOX,
} from "@/lib/logo";

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  facebook: Facebook,
  email: Mail,
} as const;

function ConnectLink({ link }: { link: SocialLink }) {
  const Icon = socialIcons[link.id];
  const isExternal = link.href.startsWith("http");

  return (
    <a
      href={link.href}
      {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center gap-3 text-sm text-foreground/70 transition-colors hover:text-rose"
    >
      <span className="grid size-8 shrink-0 place-items-center rounded-lg border border-border bg-background/60 text-foreground/70 transition group-hover:border-rose/50 group-hover:text-rose">
        <Icon size={15} />
      </span>
      <span>{link.label}</span>
    </a>
  );
}

export default function Footer({ locale }: { locale: Locale }) {
  const footerContent = content[locale].footer;
  const links = footerContent.quickLinkItems;
  const connectLinks = footerContent.connectItems;
  const isRtl = locale === "ar";

  const headingClass = `text-xs font-semibold text-rose ${
    isRtl ? "" : "font-pixel uppercase tracking-[0.2em]"
  }`;

  return (
    <footer className="relative mt-20 border-t border-border bg-card/30">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-rose/60 to-transparent" />

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr] lg:gap-14">
          <div className="max-w-sm">
            <Link
              href={`/${locale}`}
              aria-label={footerContent.name}
              className="inline-flex items-center text-foreground"
            >
              <svg
                className="h-8 w-auto"
                viewBox={LOGO_VIEWBOX}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label={footerContent.name}
              >
                <path d={LOGO_PATH} fill="currentColor" />
                <path d={LOGO_DOT_PATH} fill={LOGO_DOT_COLOR} />
              </svg>
            </Link>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {footerContent.description}
            </p>
          </div>

          <nav aria-label={footerContent.quickLinks}>
            <h2 className={headingClass}>{footerContent.quickLinks}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {links.map((link) => (
                <li key={link.href}>
                  <Link
                    href={`/${locale}${link.href}`}
                    className="group inline-flex items-center gap-2.5 text-sm text-foreground/70 transition-colors hover:text-rose"
                  >
                    <span className="h-px w-3 bg-rose/40 transition-all duration-300 group-hover:w-5 group-hover:bg-rose" />
                    <span>{link.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footerContent.connect}>
            <h2 className={headingClass}>{footerContent.connect}</h2>
            <ul className="mt-5 flex flex-col gap-3">
              {connectLinks.map((link) => (
                <li key={link.id}>
                  <ConnectLink link={link} />
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            &copy; 2026 {footerContent.name}. {footerContent.rights}
          </p>
          <p className="inline-flex items-center gap-2">
            <span className="size-1.5 rounded-full bg-rose" />
            {footerContent.crafted}
          </p>
        </div>
      </div>
    </footer>
  );
}
