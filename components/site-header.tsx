import Link from "next/link";
import { BrandMark } from "@/components/brand-mark";

export function SiteHeader() {
  return (
    <header className="site-header">
      <Link className="brand" href="/" aria-label="查U地址首页">
        <BrandMark />
        <span>查U地址</span>
      </Link>
      <nav className="site-nav" aria-label="主导航">
        <Link href="/">地址查询</Link>
        <Link href="/news">区块链新闻</Link>
        <Link href="/tools">工具导航</Link>
        <Link href="/guides">使用指南</Link>
        <span className="network-state">
          <span className="network-dot" aria-hidden="true" />
          TRON 主网
        </span>
      </nav>
    </header>
  );
}
