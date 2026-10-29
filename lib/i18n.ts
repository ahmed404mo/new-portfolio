export const locales = ["en", "ar"] as const

export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value)
}

export type LocaleLocation = {
  country: string
  countryCode: "EG"
  region: string
  workMode: readonly string[]
}

export type LocaleContent = {
  label: string
  htmlLang: string
  bcp47: string
  dir: "ltr" | "rtl"
  ogLocale: string
  alternateOgLocale: string
  title: string
  titleTemplate: string
  shortTitle: string
  appName: string
  description: string
  shortDescription: string
  ogImageAlt: string
  jobTitle: string
  alternateNames: readonly string[]
  location: LocaleLocation
  keywords: readonly string[]
  knowsAbout: readonly string[]
}

export const localeContent: Record<Locale, LocaleContent> = {
  en: {
    label: "English",
    htmlLang: "en",
    bcp47: "en-US",
    dir: "ltr",
    ogLocale: "en_US",
    alternateOgLocale: "ar_EG",
    title: "Ahmed Mokhtar (Panda) | Full Stack Software Engineer (Next.js & MERN)",
    titleTemplate: "%s | Ahmed Mokhtar (Panda)",
    shortTitle: "Ahmed Mokhtar",
    appName: "Ahmed Mokhtar Portfolio",
    description:
      "Ahmed Mokhtar (Panda / ahmed404mo) is a Full Stack Software Engineer in Egypt specializing in Next.js, React, TypeScript, Node.js, and scalable backend architectures. View projects & get in touch.",
    shortDescription:
      "Full Stack Software Engineer building high-performance, scalable web applications with Next.js, TypeScript, React, and Node.js.",
    ogImageAlt:
      "Ahmed Mokhtar (Panda) - Full Stack Software Engineer specializing in Next.js, React, and Node.js",
    jobTitle: "Full Stack Software Engineer (MERN / Next.js)",
    alternateNames: [
      "Ahmed Mokhtar",
      "Panda",
      "Ahmed Mokhtar Panda",
      "ahmed404mo",
      "أحمد مختار",
      "احمد مختار",
      "المهندس أحمد مختار",
      "المهندس احمد مختار",
      "باندا",
    ],
    location: {
      country: "Egypt",
      countryCode: "EG",
      region: "MENA",
      workMode: ["Remote", "Hybrid", "On-site", "Freelance"],
    },
    keywords: [
      // Brand & Identity Entities
      "Ahmed Mokhtar",
      "Panda",
      "panda",
      "Ahmed Mokhtar Panda",
      "ahmed404mo",
      "Ahmed Mokhtar portfolio",
      "Ahmed Mokhtar software engineer",
      "Ahmed Mokhtar developer",
      "أحمد مختار",
      "احمد مختار",
      "المهندس أحمد مختار",
      "المهندس احمد مختار",
      "باندا",

      // Core Role & Titles
      "Full Stack Developer",
      "Full Stack Software Engineer",
      "MERN Stack Developer",
      "Next.js Developer",
      "React.js Developer",
      "Node.js Backend Engineer",
      "TypeScript Software Engineer",
      "JavaScript Developer",
      "Frontend Engineer",
      "Backend Developer",

      // Geo & Hiring Intent (High-Conversion SEO)
      "Full Stack Developer Egypt",
      "Software Engineer Egypt",
      "Web Developer Egypt",
      "Hire Full Stack Developer",
      "Hire Next.js Developer",
      "Remote Full Stack Engineer",
      "Freelance Web Developer MENA",

      // Technical Stack Keywords
      "Next.js App Router",
      "React Server Components",
      "Tailwind CSS",
      "Node.js",
      "Express.js",
      "RESTful APIs",
      "MongoDB",
      "PostgreSQL",
      "Prisma ORM",
      "SQL",
      "Sequelize",
      "JWT Authentication",
      "Scalable Web Applications",

      // Cross-Language Search Queries
      "المهندس احمد مختار",
      "المهندس أحمد مختار",
      "تطوير الويب",
      "مطور ويب",
      "مهندس برمجيات",
    ],
    knowsAbout: [
      "Full Stack Web Development",
      "MERN Stack Architecture",
      "Next.js (App Router, SSR, SSG, ISR)",
      "React.js",
      "TypeScript",
      "JavaScript (ES6+)",
      "Node.js",
      "Express.js",
      "RESTful API Design & Integration",
      "MongoDB & Mongoose",
      "PostgreSQL & Prisma ORM",
      "Relational Databases (SQL & Sequelize)",
      "Authentication & Authorization (JWT, OAuth)",
      "Tailwind CSS & Responsive UI Engineering",
      "State Management",
      "Web Performance Optimization & Core Web Vitals",
      "Technical SEO & Semantic HTML",
      "Git, GitHub & CI/CD Workflows",
      "Cloud Deployment (Vercel, Cloud Hosting)",
      "Clean Code & Scalable System Design",
    ],
  },
  ar: {
    label: "العربية",
    htmlLang: "ar",
    bcp47: "ar-EG",
    dir: "rtl",
    ogLocale: "ar_EG",
    alternateOgLocale: "en_US",
    title: "أحمد مختار (باندا) | مهندس برمجيات Full Stack (MERN / Next.js)",
    titleTemplate: "%s | أحمد مختار (باندا)",
    shortTitle: "أحمد مختار",
    appName: "معرض أعمال أحمد مختار",
    description:
      "أحمد مختار (باندا / ahmed404mo) مهندس برمجيات Full Stack من مصر، متخصص في بناء تطبيقات ويب سريعة وقابلة للتوسع باستخدام Next.js وReact وTypeScript وNode.js. تصفح مشاريعي وتواصل معي.",
    shortDescription:
      "مهندس برمجيات Full Stack يبني تطبيقات ومنصات ويب متكاملة وعالية الأداء باستخدام Next.js وReact وNode.js.",
    ogImageAlt:
      "أحمد مختار (باندا) - مهندس برمجيات Full Stack متخصص في Next.js وReact وNode.js",
    jobTitle: "مهندس برمجيات Full Stack (MERN / Next.js)",
    alternateNames: [
      "أحمد مختار",
      "احمد مختار",
      "المهندس أحمد مختار",
      "المهندس احمد مختار",
      "المهندس أحمد مختار باندا",
      "المهندس احمد مختار باندا",
      "باندا",
      "أحمد مختار باندا",
      "Ahmed Mokhtar",
      "Panda",
      "ahmed404mo",
    ],
    location: {
      country: "مصر",
      countryCode: "EG",
      region: "الشرق الأوسط وشمال أفريقيا",
      workMode: ["عمل عن بعد", "دوام كامل", "عمل حر (Freelance)"],
    },
    keywords: [
      // Brand & Identity (With & Without Hamza for Arabic Search Coverage)
      "المهندس أحمد مختار",
      "المهندس احمد مختار",
      "المهندس أحمد مختار باندا",
      "المهندس احمد مختار باندا",
      "أحمد مختار",
      "احمد مختار",
      "باندا",
      "Panda",
      "panda",
      "أحمد مختار باندا",
      "احمد مختار باندا",
      "ahmed404mo",
      "أحمد مختار بورتفوليو",
      "احمد مختار بورتفوليو",
      "بورتفوليو المهندس احمد مختار",
      "بورتفوليو المهندس أحمد مختار",
      "معرض أعمال أحمد مختار",
      "معرض اعمال احمد مختار",
      "معرض أعمال المهندس احمد مختار",
      "معرض اعمال المهندس أحمد مختار",
      "موقع أحمد مختار",
      "موقع المهندس احمد مختار",
      "موقع المهندس أحمد مختار",
      "أحمد مختار مهندس برمجيات",
      "احمد مختار مهندس برمجيات",

      // Roles & Titles in Arabic
      "مهندس برمجيات",
      "مهندس برمجيات Full Stack",
      "مطور Full Stack",
      "مطور فول ستاك",
      "مطور ويب",
      "مطور ويب شامل",
      "مطور MERN Stack",
      "مطور Next.js",
      "مطور React",
      "مطور Node.js",
      "مطور واجهات أمامية",
      "مطور باك اند",
      "مطور تطبيقات ويب",

      // Geo & Hiring Intent in Arabic
      "مهندس برمجيات في مصر",
      "مطور ويب مصر",
      "مطور مواقع محترف",
      "برمجة وتطوير المواقع",
      "تصميم وتطوير مواقع ويب",
      "توظيف مطور Full Stack",

      // Tech & English Cross-Queries
      "تطوير الويب",
      "قواعد بيانات",
      "واجهات برمجة التطبيقات REST API",
      "Ahmed Mokhtar",
      "Full Stack Developer Egypt",
      "MERN Stack Developer",
      "Next.js Developer",
    ],
    knowsAbout: [
      "تطوير الويب المتكامل (Full Stack Development)",
      "هندسة تطبيقات MERN Stack",
      "إطار عمل Next.js (App Router & SSR)",
      "مكتبة React.js",
      "لغة TypeScript و JavaScript الحديثة",
      "تطوير الخوادم باستخدام Node.js و Express.js",
      "تصميم وبناء واجهات برمجة التطبيقات (RESTful APIs)",
      "قواعد البيانات غير العلائقية (MongoDB & Mongoose)",
      "قواعد البيانات العلائقية (PostgreSQL, SQL, Prisma, Sequelize)",
      "أنظمة المصادقة والحماية (JWT & Auth)",
      "تصميم الواجهات المتجاوبة باستخدام Tailwind CSS",
      "تحسين أداء الويب وسرعة التحميل (Core Web Vitals)",
      "تهيئة المواقع لمحركات البحث التقنية (Technical SEO)",
      "إدارة الأكواد والنشر السحابي (Git, GitHub, Vercel)",
      "بناء الأنظمة القابلة للتوسع (Scalable Architecture)",
    ],
  },
}

export const languageAlternates = {
  en: "/en",
  ar: "/ar",
  "x-default": "/en",
} as const

/**
 * Regional hreflang mappings recommended by Google for multi-region/multi-language SEO
 */
export const hreflangAlternates = {
  en: "/en",
  "en-US": "/en",
  ar: "/ar",
  "ar-EG": "/ar",
  "x-default": "/en",
} as const

/**
 * Helper to retrieve locale content safely with fallback to defaultLocale
 */
export function getLocaleContent(locale?: string | null): LocaleContent {
  if (locale && isLocale(locale)) {
    return localeContent[locale]
  }
  return localeContent[defaultLocale]
}
