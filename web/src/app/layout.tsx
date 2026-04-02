import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  subsets: ["latin"],
  display: 'swap',
  preload: true,
  fallback: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
});

export const metadata: Metadata = {
  title: "Mobile Skills - AI Skill 生态系统",
  description: "AI Skill 生态系统，提供丰富的 AI 角色和技能，让 AI 变得更有用、更有趣。",
  keywords: ["AI", "Skills", "智能体", "角色扮演", "技能系统"],
  authors: [{ name: "Mobile Skills Team" }],
  openGraph: {
    title: "Mobile Skills - AI Skill 生态系统",
    description: "AI Skill 生态系统，提供丰富的 AI 角色和技能",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN" className={`${inter.className} h-full antialiased`}>
      <head>
        <meta name="theme-color" content="#4f46e5" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
