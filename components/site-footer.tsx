import Link from "next/link";

export function SiteFooter() {
  return (
    <footer>
      <p>
        查U地址提供公开链上数据查询，无需登录、无需连接钱包，本站不保存查询历史，不构成投资或安全判断。
      </p>
      <div className="footer-links">
        <Link href="/news">区块链新闻</Link>
        <Link href="/tools">工具导航</Link>
        <Link href="/guides">使用指南</Link>
        <a href="https://tronscan.org" target="_blank" rel="noreferrer">
          TRONSCAN
        </a>
      </div>
    </footer>
  );
}
