"use client";

import { Diamond } from "@/components/modules/diamond";
import { usePathname } from "next/navigation";

export default function Loading() {
  const pathname = usePathname();
  const isArabic = pathname.startsWith("/ar");
  return (
    <div
      className="fixed inset-0 z-[100] flex gap-5 items-center justify-center bg-background text-foreground tracking-widest text-3xl md:text-6xl"
    >
      <Diamond className="size-20 text-[#e11d48] md:size-32" />
      <span className={isArabic ? "font-pixel-arabic font-bold text-4xl md:text-7xl" : "font-pixel"}>
        {isArabic ? "تحميل" : "LOADING"}
      </span>
    </div>
  );
}
