import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getNewsTotalPages } from "@/lib/news";
import { NewsPageContent } from "../../news-page-content";

export function generateStaticParams() {
  const totalPages = getNewsTotalPages();
  return Array.from({ length: Math.max(0, totalPages - 1) }, (_, index) => ({
    page: String(index + 2)
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const page = Number((await params).page);
  const totalPages = getNewsTotalPages();
  if (!Number.isInteger(page) || page < 2 || page > totalPages) return {};

  return {
    title: `区块链新闻中文文章第 ${page} 页 | 每周自动更新`,
    description:
      "查U地址区块链新闻分页，持续整理USDT、稳定币、钱包安全、交易所与链上资产动态中文摘要文章。",
    alternates: { canonical: `/news/page/${page}` },
    openGraph: {
      title: `区块链新闻中文文章第 ${page} 页 | 查U地址`,
      description: "每周自动整理区块链新闻中文摘要、要点和原文出处。",
      url: `/news/page/${page}`,
      type: "website"
    }
  };
}

export default async function NewsPaginationPage({
  params
}: {
  params: Promise<{ page: string }>;
}) {
  const page = Number((await params).page);
  const totalPages = getNewsTotalPages();
  if (!Number.isInteger(page) || page < 2 || page > totalPages) notFound();

  return (
    <main>
      <SiteHeader />
      <NewsPageContent currentPage={page} />
      <SiteFooter />
    </main>
  );
}
