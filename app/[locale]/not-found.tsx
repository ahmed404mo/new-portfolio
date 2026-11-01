"use client";

import { usePathname } from "next/navigation";

export default function NotFound() {
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");
  return (
    <div className="relative min-h-[calc(100vh-4rem)] bg-background border-background flex flex-col gap-2 items-center justify-center tracking-widest text-3xl md:text-6xl text-foreground">
      <h1 className="relative z-10 font-pixel text-8xl text-[#e11d48] md:size-32">404</h1>
      <span className={`relative z-10 ${isArabic ? " font-pixel-arabic font-bold text-4xl md:text-7xl" : "font-pixel"}`}>
        {isArabic ? "هذه الصفحه غير موجوده" : "page not found"}
      </span>
    </div>
  );
}
