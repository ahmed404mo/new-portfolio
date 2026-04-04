# Ahmed's Portfolio

A modern, responsive portfolio website built with Next.js, showcasing full-stack development skills, projects, certificates, and professional experience.

## 🚀 Features

- **Responsive Design**: Optimized for all devices with a dark theme
- **Dynamic Content**: Fetches profile data from a backend API
- **Interactive UI**: Smooth animations using Framer Motion
- **Component Library**: Built with Radix UI components for accessibility
- **TypeScript**: Fully typed for better development experience
- **Modern Stack**: Next.js 14 with App Router

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Analytics**: Vercel Analytics
- **Email**: EmailJS
- **Package Manager**: pnpm

## 📦 Installation

1. **Clone the repository**

   ```bash
   git clone <repository-url>
   cd portfolieo/frontent
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env.local` file in the root directory and add any required environment variables (if applicable).

4. **Run the development server**

   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🚀 Deployment

### Build for production

```bash
pnpm build
```

### Start production server

```bash
pnpm start
```

The application will be available at [http://localhost:3000](http://localhost:3000).

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── about/             # About page
│   ├── certificates/      # Certificates page
│   ├── contact/           # Contact page
│   ├── dashboard/         # Dashboard with sub-pages
│   ├── login/             # Login page
│   ├── projects/          # Projects listing and detail pages
│   ├── skills/            # Skills page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # UI components (Radix UI)
│   ├── navigation.tsx    # Navigation component
│   ├── footer.tsx        # Footer component
│   └── ...
├── data/                 # Static data files
├── hooks/                # Custom React hooks
├── lib/                  # Utility functions
├── public/               # Static assets
└── styles/               # Additional styles
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint

## 🌐 API Integration

The portfolio fetches data from a backend API hosted on Vercel:

- Profile data: `https://portfolioapi-flame.vercel.app/profile`

## 📱 Pages

- **Home**: Hero section with profile introduction
- **About**: Detailed information about the developer
- **Projects**: Showcase of completed projects
- **Skills**: Technical skills and expertise
- **Certificates**: Professional certifications
- **Contact**: Contact form and information
- **Dashboard**: Admin panel for content management

## 🎨 Design

- **Theme**: Dark theme with blue accents (#00BFFF)
- **Typography**: Inter font family
- **Animations**: Smooth transitions and micro-interactions
- **Accessibility**: Built with Radix UI for screen reader support

## 🤝 Contributing

This is a personal portfolio project. For suggestions or improvements, please create an issue or submit a pull request.

## 📄 License

This project is private and not licensed for public use.

---

Built with ❤️ by Ahmed</content>
<parameter name="filePath">d:\portfolieo\frontent\README.md
