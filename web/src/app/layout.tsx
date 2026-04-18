import type { Metadata, Viewport } from "next";
import "./globals.css";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";
import BackToTop from "@/components/BackToTop";
import FloatingAd from "@/components/FloatingAd";
import MobileBottomNav from "@/components/MobileBottomNav";
import ActivityBarrage from "@/components/ActivityBarrage";
import SEOStructuredData from "@/components/SEOStructuredData";
import { I18nProvider } from "@/components/I18nProvider";
import ToastProvider from "@/components/ToastProvider";
import ErrorBoundary from "@/components/ErrorBoundary";
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
    default: `${APP_CONFIG.name} - AI 提示词聚合平台`,
    template: `%s | ${APP_CONFIG.name}`
  },
  description: `${APP_CONFIG.description}，精选 387+ 高质量 AI 提示词和智能体，一键复制即用。`,
  keywords: ["AI", "Prompt", "提示词", "AI Prompt", "ChatGPT", "人工智能", "Prompt Engineering", "提示词工程师"],
  authors: [{ name: APP_CONFIG.author }],
  creator: APP_CONFIG.author,
  publisher: APP_CONFIG.name,
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    title: `${APP_CONFIG.name} - AI 提示词聚合平台`,
    description: `${APP_CONFIG.description}，精选高质量 AI 提示词`,
    type: "website",
    locale: "zh_CN",
    siteName: APP_CONFIG.name,
    url: APP_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.name} - AI 提示词聚合平台`,
    description: `${APP_CONFIG.description}，精选高质量 AI 提示词`,
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
      </head>
      <body className="min-h-full flex flex-col bg-gray-50 dark:bg-gray-900 transition-colors duration-300 font-sans">
        <SEOStructuredData />
        <I18nProvider>
          <ToastProvider>
            <ErrorBoundary>
              <AppHeader />
              <main className="flex-1 pb-20 sm:pb-0">{children}</main>
              <Footer />
              <BackToTop />
              <FloatingAd />
              <MobileBottomNav />
              <ActivityBarrage />
            </ErrorBoundary>
          </ToastProvider>
        </I18nProvider>
      </body>
    </html>
  );
}
