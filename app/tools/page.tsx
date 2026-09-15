import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Compass, ShieldCheck, Timer } from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { blockchainTools } from "@/lib/blockchain-tools";

export const metadata: Metadata = {
  title: "区块链工具导航 | USDT 查询、链上浏览器与钱包安全工具",
  description:
    "整理USDT地址查询、TRONSCAN、Tether透明度、钱包授权检查等区块链工具，并提供中文使用教程和安全注意事项。",
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "区块链工具导航 | 查U地址",
    description: "USDT查询、链上浏览器、稳定币资料与钱包安全工具中文导航。",
    url: "/tools",
    type: "website"
  }
};

export default function ToolsPage() {
  return (
    <main>
      <SiteHeader />
      <section className="guides-hero">
        <Compass size={30} weight="duotone" aria-hidden="true" />
        <p className="eyebrow">BLOCKCHAIN TOOL DIRECTORY</p>
        <h1>区块链工具导航</h1>
        <p>
          围绕 USDT 查询、TRON 链上浏览器、稳定币资料和钱包安全检查整理常用工具。每个工具都有独立中文教程页，说明用途、步骤和风险提醒。
        </p>
      </section>

      <section className="tool-grid" aria-label="区块链工具列表">
        {blockchainTools.map((tool) => (
          <Link className="tool-card" href={`/tools/${tool.slug}`} key={tool.slug}>
            <span className="guide-category">{tool.category}</span>
            <h2>{tool.name}</h2>
            <p>{tool.useCase}</p>
            <small>
              <Timer size={14} />
              {tool.readTime}
            </small>
            <strong>
              查看使用教程
              <ArrowRight size={16} />
            </strong>
          </Link>
        ))}
      </section>

      <section className="guide-principles" aria-label="导航原则">
        <div>
          <ShieldCheck size={21} weight="duotone" />
          <strong>优先安全工具</strong>
          <span>工具页会提示是否需要连接钱包、是否只是公开查询</span>
        </div>
        <div>
          <Compass size={21} weight="duotone" />
          <strong>站内教程承接</strong>
          <span>一级导航聚合入口，二级页面覆盖使用步骤和常见问题</span>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
