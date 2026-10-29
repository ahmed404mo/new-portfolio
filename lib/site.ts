function resolveSiteUrl() {
  const configured =
    process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.SITE_URL ??
    process.env.VERCEL_PROJECT_PRODUCTION_URL ??
    process.env.VERCEL_URL

  if (!configured) {
    return "http://localhost:3000"
  }

  const withProtocol = /^https?:\/\//i.test(configured)
    ? configured
    : `https://${configured}`

  return withProtocol.replace(/\/+$/, "")
}

export const siteConfig = {
  name: "Ahmed Mokhtar",
  alternateName: "أحمد مختار",
  alternateNames: [
    "أحمد مختار",
    "احمد مختار",
    "باندا",
    "Panda",
    "panda",
    "Ahmed Mokhtar (Panda)",
    "أحمد مختار (باندا)",
    "احمد مختار باندا",
    "ahmed404mo",
    "Ahmed Mokhtar Developer",
    "المهندس أحمد مختار",
    "المهندس احمد مختار",
  ] as const,
  username: "ahmed404mo",
  url: resolveSiteUrl(),
  email: "mo879938@gmail.com",
  phone: "+201096790839",
  avatar:
    "https://res.cloudinary.com/dzcbeupzn/image/upload/v1777433224/portfolio_assets/gqjoyhgjyb4lxu5qhbby.jpg",
  aboutImage:
    "https://res.cloudinary.com/dzcbeupzn/image/upload/v1777433245/portfolio_assets/dgwtzqbcncr44lvjydna.jpg",
  cv: "https://drive.google.com/file/d/1n9X_ICwUHT7SHMs-8PlGfc7kNiyA-8Pf/view?usp=sharing",
  location: {
    city: "Badr",
    region: "Beheira",
    country: "EG",
    countryName: "Egypt",
  },
  socials: {
    github: "https://github.com/ahmed404mo",
    linkedin: "https://www.linkedin.com/in/ahmed-mokhtar-a23a10372/",
    facebook: "https://www.facebook.com/share/17cxdv8hxb/",
  },
} as const

