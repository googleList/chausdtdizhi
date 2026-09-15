import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  Compass,
  ShieldCheck
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { blockchainTools, getBlockchainTool } from "@/lib/blockchain-tools";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3100");

export function generateStaticParams() {
  return blockchainTools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const tool = getBlockchainTool((await params).slug);
  if (!tool) return {};

  return {
    title: tool.title,
    description: tool.description,
    alternates: { canonical: `/tools/${tool.slug}` },
    openGraph: {
      title: `${tool.title} | 查U地址`,
      description: tool.description,
      type: "article",
      url: `/tools/${tool.slug}`
    }
  };
}

export default async function ToolDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const tool = getBlockchainTool((await params).slug);
  if (!tool) notFound();

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: tool.title,
        description: tool.description,
        mainEntityOfPage: `${siteUrl}/tools/${tool.slug}`,
        author: { "@type": "Organization", name: "查U地址" },
        publisher: { "@type": "Organization", name: "查U地址" },
        inLanguage: "zh-CN"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "区块链工具导航",
            item: `${siteUrl}/tools`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: tool.name,
            item: `${siteUrl}/tools/${tool.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: tool.faq.map((item) => ({
          "@type": "Question",
          name: item.question,
          acceptedAnswer: { "@type": "Answer", text: item.answer }
        }))
      }
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <SiteHeader />
      <article className="guide-article">
        <nav className="breadcrumbs" aria-label="面包屑导航">
          <Link href="/">首页</Link>
          <span>/</span>
          <Link href="/tools">区块链工具导航</Link>
          <span>/</span>
          <span>{tool.name}</span>
        </nav>

        <header className="article-header">
          <p className="eyebrow">{tool.category}</p>
          <h1>{tool.title}</h1>
          <p>{tool.description}</p>
          <span className="read-time">
            <Clock size={16} />
            {tool.readTime}
          </span>
        </header>

        <div className="article-summary">
          <Compass size={22} weight="duotone" />
          <p>{tool.useCase}</p>
        </div>

        <div className="article-body">
          <section>
            <h2>适合什么时候使用？</h2>
            <p>
              当你需要核对地址、交易、稳定币资料或钱包授权风险时，可以先从这个工具开始。使用前建议先明确网络类型，例如 TRON/TRC20、Ethereum/ERC20 或其他链。
            </p>
          </section>

          <section>
            <h2>使用步骤</h2>
            <ul>
              {tool.steps.map((step) => (
                <li key={step}>
                  <CheckCircle size={18} weight="duotone" />
                  <span>{step}</span>
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2>安全提醒</h2>
            <ul>
              {tool.tips.map((tip) => (
                <li key={tip}>
                  <ShieldCheck size={18} weight="duotone" />
                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="article-faq">
            <h2>常见问题</h2>
            {tool.faq.map((item) => (
              <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>

          <section className="article-sources">
            <h2>打开工具</h2>
            <a
              href={tool.href}
              target={tool.isInternal ? undefined : "_blank"}
              rel={tool.isInternal ? undefined : "noreferrer"}
            >
              前往 {tool.name}
              <ArrowRight size={15} />
            </a>
          </section>

          <section className="related-news">
            <h2>相关资料</h2>
            {tool.relatedGuides.map((guide) => (
              <Link href={guide.href} key={guide.href}>
                {guide.label}
                <ArrowRight size={15} />
              </Link>
            ))}
          </section>
        </div>

        <div className="article-actions">
          <Link href="/tools">
            <ArrowLeft size={17} />
            返回工具导航
          </Link>
          <Link href="/">
            查询 USDT 地址
            <ArrowRight size={17} />
          </Link>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
