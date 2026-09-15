import Link from "next/link";
import { ArrowLeft, ArrowRight, NewspaperClipping, Timer } from "@phosphor-icons/react/dist/ssr";
import newsData from "@/data/blockchain-news.json";
import { getNewsItems, getNewsTotalPages, NEWS_PAGE_SIZE } from "@/lib/news";

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

function pageHref(page: number) {
  return page <= 1 ? "/news" : `/news/page/${page}`;
}

export function NewsPageContent({ currentPage = 1 }: { currentPage?: number }) {
  const items = getNewsItems();
  const totalPages = getNewsTotalPages();
  const start = (currentPage - 1) * NEWS_PAGE_SIZE;
  const pageItems = items.slice(start, start + NEWS_PAGE_SIZE);

  return (
    <>
      <section className="guides-hero news-hero">
        <NewspaperClipping size={30} weight="duotone" aria-hidden="true" />
        <p className="eyebrow">WEEKLY BLOCKCHAIN NEWS</p>
        <h1>区块链新闻中文文章</h1>
        <small>
          最近更新：{formatDate(newsData.generatedAt)} · 共 {items.length} 条 · 第{" "}
          {currentPage}/{totalPages} 页
        </small>
      </section>

      <section className="news-list" aria-label="区块链新闻列表">
        {pageItems.length ? (
          pageItems.map((item) => (
            <article className="news-card" key={item.id}>
              <div className="news-card-meta">
                <span>{item.keyword}</span>
                <span>
                  <Timer size={14} aria-hidden="true" />
                  {formatDate(item.publishedAt)}
                </span>
              </div>
              <h2>
                <Link href={`/news/${item.slug}`}>{item.title}</Link>
              </h2>
              <p>{item.excerpt}</p>
              <Link className="news-source-link" href={`/news/${item.slug}`}>
                阅读中文文章
                <ArrowRight size={15} aria-hidden="true" />
              </Link>
            </article>
          ))
        ) : (
          <article className="news-empty">
            <strong>新闻数据等待首次自动更新</strong>
            <p>GitHub Actions 每周运行后，这里会显示最新抓取结果。</p>
          </article>
        )}
      </section>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="新闻分页">
          {currentPage > 1 ? (
            <Link href={pageHref(currentPage - 1)}>
              <ArrowLeft size={16} />
              上一页
            </Link>
          ) : (
            <span aria-disabled="true">
              <ArrowLeft size={16} />
              上一页
            </span>
          )}

          <div>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
              <Link
                aria-current={page === currentPage ? "page" : undefined}
                href={pageHref(page)}
                key={page}
              >
                {page}
              </Link>
            ))}
          </div>

          {currentPage < totalPages ? (
            <Link href={pageHref(currentPage + 1)}>
              下一页
              <ArrowRight size={16} />
            </Link>
          ) : (
            <span aria-disabled="true">
              下一页
              <ArrowRight size={16} />
            </span>
          )}
        </nav>
      )}
    </>
  );
}
