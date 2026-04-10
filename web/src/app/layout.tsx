import type { Metadata, Viewport } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingAd from "@/components/FloatingAd";
import { I18nProvider } from "@/components/I18nProvider";
import ToastProvider from "@/components/ToastProvider";
import { APP_CONFIG } from "@/lib/constants";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#4f46e5' },
    { media: '(prefers-color-scheme: dark)', color: '#4f46e5' },
  ],
};

export const metadata: Metadata = {
  title: {
    default: `${APP_CONFIG.name} - AI Skill 生态系统`,
    template: `%s | ${APP_CONFIG.name}`
  },
  description: `${APP_CONFIG.description}，提供丰富的 AI 角色和技能，让 AI 变得更有用、更有趣。`,
  keywords: ["AI", "Skills", "智能体", "角色扮演", "技能系统", "AI Agent", "Prompt Engineering"],
  authors: [{ name: APP_CONFIG.author }],
  creator: APP_CONFIG.author,
  publisher: APP_CONFIG.name,
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    title: `${APP_CONFIG.name} - AI Skill 生态系统`,
    description: `${APP_CONFIG.description}，提供丰富的 AI 角色和技能`,
    type: "website",
    locale: "zh_CN",
    siteName: APP_CONFIG.name,
    url: APP_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.name} - AI Skill 生态系统`,
    description: `${APP_CONFIG.description}，提供丰富的 AI 角色和技能`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: '/favicon.svg',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className="h-full antialiased" data-scroll-behavior="smooth" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <meta name="color-scheme" content="light dark" />
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="manifest" href="/manifest.json" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (theme === 'dark' || (!theme && prefersDark)) {
                  document.documentElement.classList.add('dark');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
        <I18nProvider>
          <ToastProvider>
            <Navbar />
            <main className="flex-1">{children}</main>
            <Footer />
            <BackToTop />
            <FloatingAd />
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
