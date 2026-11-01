"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { content } from "@/lib/content";
import type { Locale } from "@/lib/i18n";
import { useState, useEffect } from "react";
import { useTheme } from "@/components/modules/theme-provider";
import { LOGO_DOT_COLOR, LOGO_DOT_PATH, LOGO_PATH, LOGO_VIEWBOX } from "@/lib/logo";
import { Menu, Moon, Sun, X, Settings } from "lucide-react";
import { flushSync } from "react-dom";

// يحفظ حالة الترس مفتوحاً أثناء التنقل وتبديل اللغة
let savedSettingsOpen = false;

export default function Navbar({ locale }: { locale: Locale }) {
  const router = useRouter();
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(savedSettingsOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  const t = content[locale].nav;
  const pathname = usePathname();
  const otherLocale: Locale = locale === "ar" ? "en" : "ar";
  const switchHref = pathname.replace(/^\/(en|ar)(?=\/|$)/, `/${otherLocale}`) || `/${otherLocale}`;

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const handleToggleSettings = () => {
    setSettingsOpen((prev) => {
      const next = !prev;
      savedSettingsOpen = next;
      return next;
    });
  };

  const links = [
    { href: `/${locale}`, label: t.home },
    { href: `/${locale}/about`, label: t.about },
    { href: `/${locale}/projects`, label: t.projects },
    { href: `/${locale}/contact`, label: t.contact },
  ];

  const isActive = (href: string) => (href === `/${locale}` ? pathname === href : pathname.startsWith(href));

  function handleThemeToggle(event: React.MouseEvent<HTMLElement>) {
    const nextTheme = resolvedTheme === "dark" ? "light" : "dark";
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX || rect.left + rect.width / 2;
    const y = event.clientY || rect.top + rect.height / 2;

    const maxRadius = Math.hypot(Math.max(x, window.innerWidth - x), Math.max(y, window.innerHeight - y));

    if (!("startViewTransition" in document)) {
      setTheme(nextTheme);
      return;
    }

    const doc = document as Document & {
      startViewTransition: (callback: () => void) => {
        ready: Promise<void>;
        finished: Promise<void>;
      };
    };

    const transition = doc.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme);
      });
    });

    transition.ready.then(() => {
      document.documentElement.animate(
        {
          clipPath: [`circle(0px at ${x}px ${y}px)`, `circle(${Math.ceil(maxRadius)}px at ${x}px ${y}px)`],
        },
        {
          duration: 750,
          easing: "cubic-bezier(0.4, 0, 0.2, 1)",
          pseudoElement: "::view-transition-new(root)",
        },
      );
    });
  }

  function handleLanguageSwitch(event: React.MouseEvent<HTMLElement>) {
    const root = document.documentElement;
    root.dataset.transition = "lang";

    if (!("startViewTransition" in document)) {
      return;
    }

    event.preventDefault();

    const doc = document as Document & {
      startViewTransition: (callback: () => Promise<void> | void) => { finished: Promise<void> };
    };

    const transition = doc.startViewTransition(async () => {
      router.push(switchHref);
      await new Promise((r) => setTimeout(r, 60));
    });

    transition.finished.finally(() => {
      delete root.dataset.transition;
    });
  }

  return (
    <>
      <header className="sticky top-4 left-0 z-50 w-full px-4">
        <nav className="relative mx-auto max-w-6xl rounded-2xl border-2 border-[#A3263F] bg-background/70 backdrop-blur-md">
          <div className="grid h-14 grid-cols-2 items-center gap-3 px-4 sm:px-6 lg:px-8 md:grid-cols-[1fr_auto_1fr]">
            <Link
              href={`/${locale}`}
              className="flex items-center justify-self-start text-lg font-bold text-foreground"
            >
              <svg
                className="h-8 w-auto sm:h-9"
                viewBox={LOGO_VIEWBOX}
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                role="img"
                aria-label="Ahmed Mokhtar"
              >
                <path d={LOGO_PATH} fill="currentColor" />
                <path d={LOGO_DOT_PATH} fill={LOGO_DOT_COLOR} />
              </svg>
            </Link>

            <div className="hidden items-center justify-center gap-10 text-[15px] font-medium md:flex justify-self-center">
              {links.map((link) => {
                const active = isActive(link.href);

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    aria-current={active ? "page" : undefined}
                    className={active ? "text-rose" : "text-foreground/80 transition hover:text-rose"}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </div>

            <div className="hidden items-center justify-center justify-self-center gap-2 md:justify-end md:justify-self-end md:flex">
              <Link
                href={switchHref}
                onClick={handleLanguageSwitch}
                className="rounded-2xl border border-border px-3 py-1.5 font-pixel text-xs tracking-widest text-foreground/80 transition hover:border-rose hover:text-rose"
              >
                {otherLocale === "ar" ? "AR" : "EN"}
              </Link>
              <button
                type="button"
                aria-label="Toggle theme"
                onClick={handleThemeToggle}
                className="grid size-9 shrink-0 place-items-center rounded-full border border-border text-foreground/80 transition hover:border-rose hover:text-rose"
              >
                {mounted && (resolvedTheme === "dark" ? <Sun size={16} /> : <Moon size={16} />)}
              </button>
            </div>

            <div className="flex justify-self-end md:hidden">
              <button
                type="button"
                aria-label={open ? "Close menu" : "Open menu"}
                aria-expanded={open}
                aria-controls="mobile-menu"
                onClick={() => setOpen((value) => !value)}
                className="grid size-9 shrink-0 place-items-center  text-foreground/80 transition hover:border-rose hover:text-rose"
              >
                {open ? <X size={30} /> : <Menu size={30} />}
              </button>
            </div>
          </div>

          <div
            id="mobile-menu"
            className={`grid transition-[grid-template-rows] duration-200 ease-out md:hidden ${
              open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
            }`}
          >
            <div className="overflow-hidden">
              <div className="border-t border-border px-4 py-3">
                <div className="flex flex-col gap-1">
                  {links.map((link) => {
                    const active = isActive(link.href);

                    return (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setOpen(false)}
                        aria-current={active ? "page" : undefined}
                        className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                          active ? "bg-rose/10 text-rose" : "text-foreground/80 hover:bg-rose/5 hover:text-rose"
                        }`}
                      >
                        {link.label}
                      </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <aside
        dir="ltr"
        aria-label="Settings panel"
        className={`fixed left-0 top-1/2 z-50 flex -translate-y-1/2 items-center transition-transform duration-500 ease-out md:hidden ${settingsOpen ? "translate-x-0" : "-translate-x-[91px]"}`}
      >
        <div
          dir={locale === "ar" ? "rtl" : "ltr"}
          className="flex rounded-r-2xl border-y-2 border-l-0 border-[#A3263F] bg-background/70 p-4  "
        >
          <div className="flex w-full items-stretch gap-2 flex-col">
            <Link
              href={switchHref}
              onClick={handleLanguageSwitch}
              className="flex size-40 h-14 w-15 items-center justify-center border-b-2 px-1.5 py-3 font-pixel  tracking-widest  transition hover:border-rose hover:text-rose"
            >
              {otherLocale === "ar" ? "AR" : "EN"}
            </Link>
            <button
              type="button"
              aria-label="Toggle theme"
              onClick={handleThemeToggle}
              className="grid size-9 h-14 w-15 shrink-0 place-items-center  text-foreground/80 transition hover:border-rose hover:text-rose"
            >
              {mounted && (resolvedTheme === "dark" ? <Sun size={30} /> : <Moon size={30} />)}
            </button>
          </div>
        </div>
        <div className=" flex py-5 px-2.5 border-y-2 border-r-2  border-[#A3263F] bg-background/70  backdrop-blur-md rounded-r-2xl  ">
          <button
            type="button"
            aria-label="Open settings"
            aria-expanded={settingsOpen}
            onClick={handleToggleSettings}
            className=" "
          >
            <Settings
              size={30}
              className={`transition text-foreground hover:text-foreground hover:[filter:none] duration-500 ${settingsOpen ? "rotate-180" : ""}`}
            />
          </button>
        </div>
      </aside>
    </>
  );
}
