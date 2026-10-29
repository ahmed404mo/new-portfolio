import { Locale } from "./i18n";
import { siteConfig } from "./site";

type FooterLink = { label: string; href: string };

export type SocialLink = FooterLink & {
  id: "github" | "linkedin" | "facebook" | "email";
};

export type Project = {
  title: string;
  description: string;
  tech: readonly string[];
  github: string;
  live?: string;
};

export type FaqItem = { question: string; answer: string };

export type Stat = { value: string; label: string };

export type Content = {
  nav: { home: string; about: string; projects: string; contact: string };
  hero: {
    greeting: string;
    headline: string;
    intro: string;
    available: string;
    ctaProjects: string;
    ctaContact: string;
    ctaCv: string;
    location: string;
    avatarAlt: string;
  };
  about: {
    title: string;
    subtitle: string;
    paragraphs: readonly string[];
    missionTitle: string;
    missionDescription: string;
    stats: readonly Stat[];
  };
  skills: {
    title: string;
    subtitle: string;
    items: readonly string[];
  };
  projects: {
    title: string;
    subtitle: string;
    viewGithub: string;
    live: string;
    code: string;
    featured: readonly Project[];
  };
  contact: {
    title: string;
    subtitle: string;
    cta: string;
    labels: { email: string; phone: string; location: string; social: string };
  };
  faq: {
    title: string;
    items: readonly FaqItem[];
  };
  footer: {
    name: string;
    description: string;
    quickLinks: string;
    quickLinkItems: readonly FooterLink[];
    skills: string;
    connect: string;
    connectItems: readonly SocialLink[];
    rights: string;
    crafted: string;
  };
};

export const content: Record<Locale, Content> = {
  en: {
    nav: { home: "Home", about: "About", projects: "Projects", contact: "Contact" },
    hero: {
      greeting: "Hi, I'm Ahmed Mokhtar",
      headline: "Full Stack Software Engineer",
      intro:
        "I design and build scalable, high-performance web applications with MERN, Next.js, React and Node.js — from clean REST APIs to polished, accessible interfaces.",
      available: "Available for freelance and full-time opportunities",
      ctaProjects: "View Projects",
      ctaContact: "Get in touch",
      ctaCv: "Download CV",
      location: "Egypt",
      avatarAlt: "Ahmed Mokhtar, Full Stack Software Engineer",
    },
    about: {
      title: "About Me",
      subtitle: "Engineering scalable web applications and clean digital experiences.",
      paragraphs: [
        "I'm Ahmed Mokhtar, a Full Stack Software Engineer based in Egypt. I specialize in the MERN stack and Next.js, building production-ready web applications with React on the frontend and Node.js, Express and MongoDB on the backend.",
        "I care about performance, accessibility and maintainable code. My experience spans REST API design, relational and NoSQL databases with SQL/Sequelize and MongoDB/Mongoose, authentication, and serverless deployment on Vercel.",
      ],
      missionTitle: "My Technical Mission",
      missionDescription:
        "I am a passionate Full-Stack Developer specializing in the MERN stack and Next.js. My mission is to bridge the gap between seamless user interfaces and robust backend architectures. With a strong foundation in React and versatile database management (SQL & NoSQL), I strive to build high-performance, scalable web applications that solve real-world problems and deliver exceptional user experiences.",
      stats: [
        { value: "2", label: "Projects" },
        { value: "6", label: "Certificates" },
        { value: "23", label: "Skills" },
      ],
    },
    skills: {
      title: "Skills & Technologies",
      subtitle: "The tools I use to ship reliable products end to end.",
      items: [
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
        "SQL",
        "Sequelize",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "REST APIs",
        "Redux",
        "jQuery",
        "Python",
        "C++",
        "MySQL",
        "Git & GitHub",
        "Vercel",
        "Postman",
        "NPM",
        "Web Performance",
        "Responsive Design",
      ],
    },
    projects: {
      title: "Selected Projects",
      subtitle: "A few things I've designed, built and shipped.",
      viewGithub: "View more on GitHub",
      live: "Live demo",
      code: "Source code",
      featured: [
        {
          title: "Trendify — Modern E-Commerce Platform",
          description:
            "A responsive and interactive e-commerce frontend built with React.js and Bootstrap. It features dynamic product displays, intuitive navigation and a fully mobile-optimized layout.",
          tech: ["React", "Bootstrap", "CSS3"],
          github: "https://github.com/ahmed404mo/E-Commerce",
          live: "https://ahmed404mo.github.io/E-Commerce/#/home/all",
        },
        {
          title: "Dynamic Personal Portfolio & CMS",
          description:
            "A fully dynamic portfolio powered by Next.js and Tailwind CSS on the frontend, with a Node.js, Express and MongoDB REST API, JWT authentication, Cloudinary media storage and an admin dashboard.",
          tech: ["Next.js", "Node.js", "Express", "MongoDB", "Cloudinary"],
          github: "https://github.com/ahmed404mo/frontPortfolio",
          live: "https://portfolio-r2io6cxij-mo879938-5607s-projects.vercel.app/",
        },
      ],
    },
    contact: {
      title: "Let's Work Together",
      subtitle:
        "Have a project, a role or an idea? I'd love to hear about it. I usually reply within a day.",
      cta: "Send me an email",
      labels: { email: "Email", phone: "Phone", location: "Location", social: "Find me online" },
    },
    faq: {
      title: "Frequently Asked Questions",
      items: [
        {
          question: "Who is Ahmed Mokhtar?",
          answer:
            "Ahmed Mokhtar is a Full Stack Software Engineer from Egypt who specializes in the MERN stack, Next.js, React and Node.js. He builds scalable, production-ready web applications and REST APIs.",
        },
        {
          question: "What technologies does Ahmed Mokhtar use?",
          answer:
            "Ahmed works with React.js, Next.js, Node.js, Express.js, MongoDB, Mongoose, SQL, Sequelize, TypeScript, JavaScript and Tailwind CSS, and deploys applications on Vercel.",
        },
        {
          question: "Is Ahmed Mokhtar available for freelance work?",
          answer:
            "Yes. Ahmed is available for freelance projects and full-time roles. You can reach him by email or through LinkedIn.",
        },
        {
          question: "Where is Ahmed Mokhtar based?",
          answer:
            "Ahmed Mokhtar is based in Egypt and works remotely with teams and clients worldwide.",
        },
        {
          question: "How can I contact Ahmed Mokhtar?",
          answer: `You can email ${siteConfig.email}, call ${siteConfig.phone}, or connect with him on LinkedIn and GitHub.`,
        },
      ],
    },
    footer: {
      name: "Ahmed Mokhtar",
      description: "Full-Stack Developer | Building modern web applications with MERN Stack & Next.js",
      quickLinks: "Quick Links",
      quickLinkItems: [
        { label: "Home", href: "/" },
        { label: "About", href: "/about" },
        { label: "Projects", href: "/projects" },
        { label: "Contact", href: "/contact" },
      ],
      skills: "Skills",
      connect: "Connect",
      connectItems: [
        { id: "github", label: "GitHub", href: siteConfig.socials.github },
        { id: "linkedin", label: "LinkedIn", href: siteConfig.socials.linkedin },
        { id: "facebook", label: "Facebook", href: siteConfig.socials.facebook },
        { id: "email", label: "Email", href: `mailto:${siteConfig.email}` },
      ],
      rights: "All rights reserved.",
      crafted: "Crafted with clean code.",
    },
  },
  ar: {
    nav: { home: "الرئيسية", about: "عني", projects: "المشاريع", contact: "تواصل معي" },
    hero: {
      greeting: "أهلاً، أنا أحمد مختار",
      headline: "مهندس برمجيات Full Stack",
      intro:
        "أصمم وأبني تطبيقات ويب قابلة للتوسع وعالية الأداء باستخدام MERN وNext.js وReact وNode.js — من واجهات REST API نظيفة إلى واجهات استخدام سريعة وسهلة.",
      available: "متاح للعمل الحر والوظائف بدوام كامل",
      ctaProjects: "استعرض المشاريع",
      ctaContact: "تواصل معي",
      ctaCv: "تحميل السيرة الذاتية",
      location: "مصر",
      avatarAlt: "أحمد مختار، مهندس برمجيات Full Stack",
    },
    about: {
      title: "من أنا",
      subtitle: "أهندس تطبيقات ويب قابلة للتوسع وتجارب رقمية نظيفة.",
      paragraphs: [
        "أنا أحمد مختار، مهندس برمجيات Full Stack من مصر. متخصص في MERN Stack وNext.js، وأبني تطبيقات ويب جاهزة للإنتاج باستخدام React في الواجهة الأمامية وNode.js وExpress وMongoDB في الخلفية.",
        "أهتم بالأداء وإمكانية الوصول والكود سهل الصيانة. تشمل خبرتي تصميم REST APIs، وقواعد بيانات علائقية وNoSQL باستخدام SQL/Sequelize وMongoDB/Mongoose، والمصادقة، والنشر على Vercel.",
      ],
      missionTitle: "رسالتي التقنية",
      missionDescription:
        "أنا مطور Full Stack شغوف متخصص في MERN Stack وNext.js. رسالتي هي ردم الفجوة بين واجهات استخدام سلسة وبنى خلفية قوية. بخبرة في React وإدارة قواعد البيانات (SQL وNoSQL)، أسعى لبناء تطبيقات ويب عالية الأداء وقابلة للتوسع تحل مشاكل حقيقية وتقدم تجارب استثنائية.",
      stats: [
        { value: "2", label: "مشروع" },
        { value: "6", label: "شهادة" },
        { value: "23", label: "مهارة" },
      ],
    },
    skills: {
      title: "المهارات والتقنيات",
      subtitle: "الأدوات التي أستخدمها لبناء منتجات موثوقة من البداية للنهاية.",
      items: [
        "React.js",
        "Next.js",
        "Node.js",
        "Express.js",
        "MongoDB",
        "Mongoose",
        "SQL",
        "Sequelize",
        "TypeScript",
        "JavaScript",
        "Tailwind CSS",
        "REST APIs",
        "Redux",
        "jQuery",
        "Python",
        "C++",
        "MySQL",
        "Git & GitHub",
        "Vercel",
        "Postman",
        "NPM",
        "أداء الويب",
        "تصميم متجاوب",
      ],
    },
    projects: {
      title: "مشاريع مختارة",
      subtitle: "بعض الأعمال التي صممتها وبنيتها ونشرتها.",
      viewGithub: "المزيد على GitHub",
      live: "نسخة مباشرة",
      code: "الكود المصدري",
      featured: [
        {
          title: "Trendify — منصة تجارة إلكترونية حديثة",
          description:
            "واجهة تجارة إلكترونية تفاعلية ومتجاوبة مبنية بـ React.js وBootstrap، وتشمل عرض منتجات ديناميكي وتنقل سهل وتصميمًا محسّنًا بالكامل للموبايل.",
          tech: ["React", "Bootstrap", "CSS3"],
          github: "https://github.com/ahmed404mo/E-Commerce",
          live: "https://ahmed404mo.github.io/E-Commerce/#/home/all",
        },
        {
          title: "بورتفوليو شخصي ديناميكي مع لوحة تحكم",
          description:
            "موقع بورتفوليو ديناميكي بالكامل مبني بـ Next.js وTailwind CSS، مع REST API باستخدام Node.js وExpress وMongoDB، ومصادقة JWT، وتخزين وسائط على Cloudinary، ولوحة تحكم إدارية.",
          tech: ["Next.js", "Node.js", "Express", "MongoDB", "Cloudinary"],
          github: "https://github.com/ahmed404mo/frontPortfolio",
          live: "https://portfolio-r2io6cxij-mo879938-5607s-projects.vercel.app/",
        },
      ],
    },
    contact: {
      title: "لنعمل معًا",
      subtitle:
        "لديك مشروع أو وظيفة أو فكرة؟ يسعدني أن أسمع عنها. عادةً أرد خلال يوم واحد.",
      cta: "أرسل لي بريدًا إلكترونيًا",
      labels: { email: "البريد الإلكتروني", phone: "الهاتف", location: "الموقع", social: "تجدني على" },
    },
    faq: {
      title: "أسئلة شائعة",
      items: [
        {
          question: "من هو أحمد مختار؟",
          answer:
            "أحمد مختار مهندس برمجيات Full Stack من مصر متخصص في MERN Stack وNext.js وReact وNode.js، ويبني تطبيقات ويب وREST APIs قابلة للتوسع وجاهزة للإنتاج.",
        },
        {
          question: "ما التقنيات التي يستخدمها أحمد مختار؟",
          answer:
            "يعمل أحمد بـ React.js وNext.js وNode.js وExpress.js وMongoDB وMongoose وSQL وSequelize وTypeScript وJavaScript وTailwind CSS، وينشر التطبيقات على Vercel.",
        },
        {
          question: "هل أحمد مختار متاح للعمل الحر؟",
          answer:
            "نعم، أحمد متاح للمشاريع الحرة والوظائف بدوام كامل، ويمكن التواصل معه عبر البريد الإلكتروني أو LinkedIn.",
        },
        {
          question: "أين يقيم أحمد مختار؟",
          answer: "يقيم أحمد مختار في مصر ويعمل عن بُعد مع فرق وعملاء حول العالم.",
        },
        {
          question: "كيف يمكنني التواصل مع أحمد مختار؟",
          answer: `يمكنك مراسلة ${siteConfig.email}، أو الاتصال على ${siteConfig.phone}، أو التواصل عبر LinkedIn وGitHub.`,
        },
      ],
    },
    footer: {
      name: "أحمد مختار",
      description: "مطور Full Stack | أبني تطبيقات ويب حديثة باستخدام MERN Stack وNext.js",
      quickLinks: "روابط سريعة",
      quickLinkItems: [
        { label: "الرئيسية", href: "/" },
        { label: "عني", href: "/about" },
        { label: "المشاريع", href: "/projects" },
        { label: "تواصل معي", href: "/contact" },
      ],
      skills: "المهارات",
      connect: "تواصل معي",
      connectItems: [
        { id: "github", label: "GitHub", href: siteConfig.socials.github },
        { id: "linkedin", label: "LinkedIn", href: siteConfig.socials.linkedin },
        { id: "facebook", label: "Facebook", href: siteConfig.socials.facebook },
        { id: "email", label: "البريد الإلكتروني", href: `mailto:${siteConfig.email}` },
      ],
      rights: "جميع الحقوق محفوظة.",
      crafted: "صُنع بكود نظيف.",
    },
  },
};
