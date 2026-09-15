import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3100");

const geist = Geist({
  variable: "--font-sans",
  subsets: ["latin"]
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"]
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "USDT地址查询 | 无需登录、无需连接钱包",
    template: "%s | 查U地址"
  },
  description:
    "查询TRON地址的USDT余额、TRX余额与TRC20交易记录。无需登录、无需连接钱包，本站不保存查询历史，数据来自TRON主网。",
  keywords: [
    "USDT查询",
    "USDT地址查询",
    "查U地址",
    "查USDT余额",
    "USDT钱包查询",
    "TRC20地址查询",
    "TRON地址查询",
    "TRC20查询",
    "USDT余额查询",
    "USDT交易记录",
    "USDT转账记录查询",
    "TRON钱包余额查询",
    "免费查U"
  ],
  alternates: {
    canonical: "/"
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  openGraph: {
    title: "USDT地址查询 | 无需登录、无需连接钱包",
    description:
      "查询USDT余额、TRX余额和TRC20交易记录。无需登录、无需连接钱包，本站不保存查询历史。",
    type: "website",
    locale: "zh_CN",
    url: "/",
    siteName: "查U地址"
  },
  twitter: {
    card: "summary",
    title: "USDT地址查询 | 无需登录、无需连接钱包",
    description:
      "查询USDT余额与TRC20交易记录。无需登录、无需连接钱包，本站不保存查询历史。"
  },
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION
  },
  category: "finance"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f7f7f8"
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-CN">
      <body className={`${geist.variable} ${geistMono.variable}`}>
        {children}
      </body>
    </html>
  );
}
