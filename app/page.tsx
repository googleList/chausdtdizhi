import { AddressExplorer } from "@/components/address-explorer";
import {
  Database,
  LockKey,
  MagnifyingGlass,
  ShieldCheck
} from "@phosphor-icons/react/dist/ssr";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3100");

export default function HomePage() {
  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: "查U地址",
        url: siteUrl,
        applicationCategory: "FinanceApplication",
        operatingSystem: "Any",
        description:
          "查询 TRON 地址的 TRC20 USDT 余额、TRX 余额和链上交易记录。无需登录、无需连接钱包，本站不保存查询历史。",
        featureList: [
          "TRC20 USDT 余额查询",
          "TRX 余额查询",
          "USDT 转入转出记录查询",
          "无需登录",
          "无需连接钱包",
          "本站不保存查询历史"
        ],
        offers: {
          "@type": "Offer",
          price: "0",
          priceCurrency: "CNY"
        }
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "如何查询 TRON 地址的 USDT 余额？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "在查U地址输入以 T 开头的 TRON 地址，即可读取该地址在 TRON 主网上的 TRC20 USDT 余额和最近确认交易。"
            }
          },
          {
            "@type": "Question",
            name: "USDT 人民币金额如何计算？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "人民币金额根据公开的 USDT/CNY 参考汇率换算，仅用于信息展示，实际成交价格可能不同。"
            }
          },
          {
            "@type": "Question",
            name: "查询地址需要连接钱包吗？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "不需要。查U地址只读取公开链上数据，不会请求私钥、助记词或钱包授权。"
            }
          },
          {
            "@type": "Question",
            name: "查询 USDT 地址需要登录或连接钱包吗？",
            acceptedAnswer: {
              "@type": "Answer",
              text: "不需要。查询 USDT 地址无需登录、无需连接钱包，本站不保存查询历史。查询仍会读取公开链上数据，并由公开数据接口处理请求。"
            }
          }
        ]
      }
    ]
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <SiteHeader />

      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">SAFE & PRIVATE TRC20 EXPLORER</p>
          <h1>
            USDT 地址查询 <span>无需登录连接钱包</span>
          </h1>
          <p className="hero-description">
            无需登录、无需连接钱包。输入 TRON 地址，即刻查询 USDT
            余额、TRX 余额与最近 TRC20 转账记录。
          </p>
        </div>

        <AddressExplorer />

        <aside className="security-note" aria-label="隐私与安全说明">
          <ShieldCheck size={21} weight="duotone" aria-hidden="true" />
          <div>
            <strong>无需登录、无需连接钱包</strong>
            <p>
              本站不保存您输入的地址和查询历史，不要求注册、登录、私钥、助记词、签名或钱包授权。查询会直接读取公开区块链与汇率接口，请勿向任何人泄露钱包敏感信息。
            </p>
          </div>
        </aside>
      </section>

      <section className="trust-strip" aria-label="服务说明">
        <div>
          <Database size={22} weight="duotone" aria-hidden="true" />
          <strong>公开数据</strong>
          <span>直接读取 TRON 主网</span>
        </div>
        <div>
          <LockKey size={22} weight="duotone" aria-hidden="true" />
          <strong>不保存查询历史</strong>
          <span>无需登录或连接钱包</span>
        </div>
        <div>
          <ShieldCheck size={22} weight="duotone" aria-hidden="true" />
          <strong>即时结果</strong>
          <span>展示最新确认记录</span>
        </div>
      </section>

      <section className="seo-content" aria-labelledby="about-title">
        <div className="seo-intro">
          <MagnifyingGlass size={26} weight="duotone" aria-hidden="true" />
          <h2 id="about-title">无需登录、无需连接钱包的 TRON USDT 地址查询工具</h2>
          <p>
            查U地址是一款免费的 TRON USDT 查询工具，可查询 TRC20 USDT
            余额、人民币参考估值、TRX 余额及最近转入转出记录。输入公开地址即可查询，无需登录、无需连接钱包，本站不保存查询历史。
          </p>
        </div>
        <div className="faq-list">
          <article>
            <h3>如何查询 USDT 地址余额？</h3>
            <p>粘贴以 T 开头的 TRON 地址，点击查询即可查看已确认的链上数据。</p>
          </article>
          <article>
            <h3>人民币估值准确吗？</h3>
            <p>页面使用公开 USDT/CNY 汇率换算，仅供参考，不代表实际成交价格。</p>
          </article>
          <article>
            <h3>USDT 地址查询是否需要登录或连接钱包？</h3>
            <p>
              本站只读取公开链上数据，不保存查询历史，也不会要求私钥、助记词、签名或钱包授权。
            </p>
          </article>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
}
