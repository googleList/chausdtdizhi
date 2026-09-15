import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpenText,
  CheckCircle,
  ShieldCheck,
  Timer
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { guides } from "@/lib/guides";

export const metadata: Metadata = {
  title: "USDT 与 TRC20 使用指南",
  description:
    "TRC20地址、USDT转账网络、未到账排查与钱包地址安全指南，帮助你正确查询和核对链上记录。",
  alternates: { canonical: "/guides" },
  openGraph: {
    title: "USDT 与 TRC20 使用指南 | 查U地址",
    description: "了解TRC20地址、USDT转账查询、网络区别与地址安全。",
    url: "/guides",
    type: "website"
  }
};

export default function GuidesPage() {
  return (
    <main>
      <SiteHeader />
      <section className="guides-hero">
        <BookOpenText size={30} weight="duotone" aria-hidden="true" />
        <p className="eyebrow">USDT KNOWLEDGE BASE</p>
        <h1>USDT 与 TRC20 使用指南</h1>
        <p>
          从识别地址到排查未到账，再到转账前的安全核对。每篇内容都围绕一个具体问题，并引用官方资料。
        </p>
      </section>

      <section className="guide-index" aria-label="指南目录">
        {guides.map((guide, index) => (
          <Link
            className="guide-index-item"
            href={`/guides/${guide.slug}`}
            key={guide.slug}
          >
            <span className="guide-number">{String(index + 1).padStart(2, "0")}</span>
            <div>
              <span className="guide-category">{guide.eyebrow}</span>
              <h2>{guide.shortTitle}</h2>
              <p>{guide.description}</p>
              <small>
                <Timer size={14} />
                {guide.readTime}
              </small>
            </div>
            <ArrowRight size={22} weight="bold" aria-hidden="true" />
          </Link>
        ))}
      </section>

      <section className="guide-principles" aria-label="内容原则">
        <div>
          <CheckCircle size={21} weight="duotone" />
          <strong>解决具体问题</strong>
          <span>不制造重复、空泛的关键词页面</span>
        </div>
        <div>
          <ShieldCheck size={21} weight="duotone" />
          <strong>不夸大风险判断</strong>
          <span>链上数据不等同于身份或合规结论</span>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
