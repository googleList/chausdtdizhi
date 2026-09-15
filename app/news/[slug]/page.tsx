import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  NewspaperClipping,
  ShieldCheck
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import newsData from "@/data/blockchain-news.json";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3100");

function getArticle(slug: string) {
  return newsData.items.find((item) => item.slug === slug);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(new Date(value));
}

export function generateStaticParams() {
  return newsData.items.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const article = getArticle((await params).slug);
  if (!article) return {};

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    alternates: { canonical: `/news/${article.slug}` },
    openGraph: {
      title: `${article.seoTitle} | 查U地址`,
      description: article.seoDescription,
      type: "article",
      url: `/news/${article.slug}`,
      publishedTime: article.publishedAt
    }
  };
}

export default async function NewsArticlePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const related = newsData.items
    .filter((item) => item.slug !== article.slug)
    .slice(0, 3);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: article.title,
        alternativeHeadline: article.originalTitle,
        description: article.seoDescription,
        datePublished: article.publishedAt,
        dateModified: newsData.generatedAt,
        mainEntityOfPage: `${siteUrl}/news/${article.slug}`,
        author: { "@type": "Organization", name: "查U地址" },
        publisher: { "@type": "Organization", name: "查U地址" },
        isBasedOn: article.sourceUrl,
        inLanguage: "zh-CN",
        keywords: [article.keyword, "区块链新闻", "USDT", "链上查询"]
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "首页", item: siteUrl },
          {
            "@type": "ListItem",
            position: 2,
            name: "区块链新闻",
            item: `${siteUrl}/news`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: article.title,
            item: `${siteUrl}/news/${article.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: article.faq.map((item) => ({
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
          <Link href="/news">区块链新闻</Link>
          <span>/</span>
          <span>{article.keyword}</span>
        </nav>

        <header className="article-header">
          <p className="eyebrow">{article.keyword}</p>
          <h1>{article.title}</h1>
          <p>{article.excerpt}</p>
          <span className="read-time">
            <Clock size={16} />
            {article.readTime} · {formatDate(article.publishedAt)}
          </span>
        </header>

        <div className="article-summary">
          <NewspaperClipping size={22} weight="duotone" />
          <p>{article.summary}</p>
        </div>

        <div className="article-body">
          {article.sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.points && (
                <ul>
                  {section.points.map((point) => (
                    <li key={point}>
                      <CheckCircle size={18} weight="duotone" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}

          <section className="article-faq">
            <h2>常见问题</h2>
            {article.faq.map((item) => (
              <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>

          <aside className="article-safety">
            <ShieldCheck size={22} weight="duotone" />
            <p>
              本站根据公开 RSS 标题与摘要生成中文摘要和解读，不复制来源网站全文。新闻内容仅供信息参考，不构成投资建议或地址安全结论。
            </p>
          </aside>

          <section className="article-sources">
            <h2>原文与核对来源</h2>
            <a href={article.sourceUrl} target="_blank" rel="noreferrer">
              {article.source}：{article.originalTitle}
              <ArrowRight size={15} />
            </a>
          </section>

          {related.length > 0 && (
            <section className="related-news">
              <h2>相关阅读</h2>
              {related.map((item) => (
                <Link href={`/news/${item.slug}`} key={item.slug}>
                  {item.title}
                  <ArrowRight size={15} />
                </Link>
              ))}
            </section>
          )}
        </div>

        <div className="article-actions">
          <Link href="/news">
            <ArrowLeft size={17} />
            返回区块链新闻
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
