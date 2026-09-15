import type { Metadata } from "next";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { NewsPageContent } from "./news-page-content";

export const metadata: Metadata = {
  title: "区块链新闻中文站内文章 | 每周自动更新",
  description:
    "每周自动整理区块链、USDT、稳定币、钱包安全与链上资产相关新闻，生成中文站内摘要文章、要点和原文出处。",
  alternates: { canonical: "/news" },
  openGraph: {
    title: "区块链新闻中文站内文章 | 查U地址",
    description:
      "自动整理区块链、USDT、稳定币与链上安全相关新闻，提供中文摘要、要点和来源核对。",
    url: "/news",
    type: "website"
  }
};

export default function NewsPage() {
  return (
    <main>
      <SiteHeader />
      <NewsPageContent />
      <SiteFooter />
    </main>
  );
}
