"use client";

import "@/styles/globals.css";
import { Silkscreen, Handjet } from "next/font/google";
import { usePathname } from "next/navigation";

const pixel = Silkscreen({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-silkscreen",
});

const pixelArabic = Handjet({
  subsets: ["arabic"],
  weight: ["400", "700"],
  variable: "--font-handjet",
});

export default function NotFound() {
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");
  return (
    <div
      className={`${pixel.variable} ${pixelArabic.variable} bg-background border-background flex-col gap-2 w-full flex h-screen items-center justify-center tracking-widest text-3xl md:text-6xl text-foreground`}
    >
      <h1 className="font-pixel text-8xl text-[#e11d48] md:size-32">404</h1>
      <span className={isArabic ? "font-pixel-arabic font-bold text-4xl md:text-7xl" : "font-pixel"}>
        {isArabic ? "هذه الصفحه غير موجوده" : "page not found"}
      </span>
    </div>
  );
}
