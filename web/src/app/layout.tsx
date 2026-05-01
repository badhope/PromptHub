import type { Metadata, Viewport } from "next";
import "./globals.css";
import ClientProviders from "./ClientProviders";
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
    default: `${APP_CONFIG.name} · ${APP_CONFIG.brandName} - AI 应用商店`,
    template: `%s | ${APP_CONFIG.name} ${APP_CONFIG.brandName}`
  },
  description: `${APP_CONFIG.description}，探索全球精选 AI 智能体、Agent、工具。一键导出，适用于豆包、ChatGPT、Kimi、Claude。`,
  keywords: ["AI", "Agent", "智能体", "AI App Store", "Skillora", "灵境", "ChatGPT", "豆包", "Kimi", "Claude", "Prompt", "提示词", "AI 应用商店"],
  authors: [{ name: APP_CONFIG.author }],
  creator: APP_CONFIG.author,
  publisher: APP_CONFIG.name,
  metadataBase: new URL(APP_CONFIG.url),
  openGraph: {
    title: `${APP_CONFIG.name} · ${APP_CONFIG.brandName} - AI 应用商店`,
    description: `${APP_CONFIG.description}，探索全球精选 AI 智能体`,
    type: "website",
    locale: "zh_CN",
    siteName: `${APP_CONFIG.name} ${APP_CONFIG.brandName}`,
    url: APP_CONFIG.url,
  },
  twitter: {
    card: "summary_large_image",
    title: `${APP_CONFIG.name} · ${APP_CONFIG.brandName} - AI 应用商店`,
    description: `${APP_CONFIG.description}，探索全球精选 AI 智能体`,
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
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
