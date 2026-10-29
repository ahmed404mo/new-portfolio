"use client";

import { usePathname, useServerInsertedHTML } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

export type Theme = "light" | "dark" | "system";
export type ResolvedTheme = "light" | "dark";

type ThemeContextValue = {
  theme: Theme;
  resolvedTheme: ResolvedTheme;
  systemTheme: ResolvedTheme;
  themes: Theme[];
  setTheme: (theme: Theme | ((current: Theme) => Theme)) => void;
};

const STORAGE_KEY = "theme";
const DEFAULT_THEME: Theme = "dark";
const THEMES: Theme[] = ["light", "dark", "system"];

const THEME_SCRIPT = `(function(){try{var t=localStorage.getItem("theme");if(t!=="light"&&t!=="dark"&&t!=="system")t="dark";var d=t==="dark"||(t==="system"&&window.matchMedia("(prefers-color-scheme: dark)").matches);var r=document.documentElement;r.classList.toggle("dark",d);r.classList.toggle("light",!d);r.style.colorScheme=d?"dark":"light";}catch(e){}})();`;

const ThemeContext = createContext<ThemeContextValue | null>(null);

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect;

function ThemeScript() {
  useServerInsertedHTML(() => (
    <script
      key="theme-script"
      dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }}
    />
  ));

  return null;
}

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

function getSystemTheme(): ResolvedTheme {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme): ResolvedTheme {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;

  root.classList.toggle("dark", resolved === "dark");
  root.classList.toggle("light", resolved === "light");
  root.style.colorScheme = resolved;

  return resolved;
}

function getInitialTheme(): Theme {
  if (typeof document === "undefined") return DEFAULT_THEME;
  return document.documentElement.classList.contains("light") ? "light" : DEFAULT_THEME;
}

function getInitialSystemTheme(): ResolvedTheme {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.classList.contains("light") ? "light" : "dark";
}

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [theme, setThemeState] = useState<Theme>(getInitialTheme);
  const [systemTheme, setSystemTheme] = useState<ResolvedTheme>(getInitialSystemTheme);
  const themeRef = useRef(theme);

  themeRef.current = theme;

  useIsomorphicLayoutEffect(() => {
    let stored = DEFAULT_THEME;

    try {
      const value = window.localStorage.getItem(STORAGE_KEY);
      if (isTheme(value)) stored = value;
    } catch {
      // localStorage can be unavailable (private mode, blocked cookies).
    }

    setThemeState(stored);
    setSystemTheme(getSystemTheme());
    applyTheme(stored);
  }, []);

  useIsomorphicLayoutEffect(() => {
    applyTheme(theme);
  }, [theme, pathname]);

  useEffect(() => {
    const root = document.documentElement;

    const observer = new MutationObserver(() => {
      const expected =
        themeRef.current === "system" ? getSystemTheme() : themeRef.current;

      if (!root.classList.contains(expected)) applyTheme(themeRef.current);
    });

    observer.observe(root, { attributes: true, attributeFilter: ["class"] });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-color-scheme: dark)");

    const handleChange = () => {
      setSystemTheme(media.matches ? "dark" : "light");
      if (theme === "system") applyTheme("system");
    };

    media.addEventListener("change", handleChange);
    return () => media.removeEventListener("change", handleChange);
  }, [theme]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== STORAGE_KEY || !isTheme(event.newValue)) return;

      setThemeState(event.newValue);
      applyTheme(event.newValue);
    };

    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  const setTheme = useCallback<ThemeContextValue["setTheme"]>((next) => {
    setThemeState((current) => {
      const value = typeof next === "function" ? next(current) : next;

      applyTheme(value);

      try {
        window.localStorage.setItem(STORAGE_KEY, value);
      } catch {
        // Ignore storage errors; the theme still applies for this session.
      }

      return value;
    });
  }, []);

  const resolvedTheme = theme === "system" ? systemTheme : theme;

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      resolvedTheme,
      systemTheme,
      themes: THEMES,
      setTheme,
    }),
    [theme, resolvedTheme, systemTheme, setTheme],
  );

  return (
    <ThemeContext.Provider value={value}>
      <ThemeScript />
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }

  return context;
}

export function useOptionalTheme() {
  return useContext(ThemeContext);
}
