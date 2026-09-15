import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Clock,
  MagnifyingGlass,
  ShieldCheck
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { getGuide, guides } from "@/lib/guides";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3100");

export function generateStaticParams() {
  return guides.map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const guide = getGuide((await params).slug);
  if (!guide) return {};

  return {
    title: guide.title,
    description: guide.description,
    alternates: { canonical: `/guides/${guide.slug}` },
    openGraph: {
      title: `${guide.title} | 查U地址`,
      description: guide.description,
      type: "article",
      url: `/guides/${guide.slug}`
    }
  };
}

export default async function GuidePage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const guide = getGuide((await params).slug);
  if (!guide) notFound();
  const currentIndex = guides.findIndex((item) => item.slug === guide.slug);
  const nextGuide = guides[(currentIndex + 1) % guides.length];

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: guide.title,
        description: guide.description,
        mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
        author: { "@type": "Organization", name: "查U地址" },
        publisher: { "@type": "Organization", name: "查U地址" },
        inLanguage: "zh-CN"
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "首页",
            item: siteUrl
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "使用指南",
            item: `${siteUrl}/guides`
          },
          {
            "@type": "ListItem",
            position: 3,
            name: guide.shortTitle,
            item: `${siteUrl}/guides/${guide.slug}`
          }
        ]
      },
      {
        "@type": "FAQPage",
        mainEntity: guide.faq.map((item) => ({
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
          <Link href="/guides">使用指南</Link>
          <span>/</span>
          <span>{guide.shortTitle}</span>
        </nav>

        <header className="article-header">
          <p className="eyebrow">{guide.eyebrow}</p>
          <h1>{guide.title}</h1>
          <p>{guide.description}</p>
          <span className="read-time">
            <Clock size={16} />
            {guide.readTime}
          </span>
        </header>

        <div className="article-summary">
          <MagnifyingGlass size={22} weight="duotone" />
          <p>{guide.summary}</p>
        </div>

        <div className="article-body">
          {guide.sections.map((section) => (
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
            {guide.faq.map((item) => (
              <div key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>

          <aside className="article-safety">
            <ShieldCheck size={22} weight="duotone" />
            <p>
              查U地址只读取公开链上数据，不保存查询记录，不会请求私钥、助记词、签名或钱包授权。
            </p>
          </aside>

          <section className="article-sources">
            <h2>官方参考资料</h2>
            {guide.sources.map((source) => (
              <a href={source.href} target="_blank" rel="noreferrer" key={source.href}>
                {source.label}
                <ArrowRight size={15} />
              </a>
            ))}
          </section>
        </div>

        <div className="article-actions">
          <Link href="/">
            <ArrowLeft size={17} />
            查询 USDT 地址
          </Link>
          <Link href={`/guides/${nextGuide.slug}`}>
            下一篇：{nextGuide.shortTitle}
            <ArrowRight size={17} />
          </Link>
        </div>
      </article>
      <SiteFooter />
    </main>
  );
}
