import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname } from "node:path";
import { XMLParser } from "fast-xml-parser";

const OUTPUT_PATH = "data/blockchain-news.json";
const MAX_ITEMS = 24;
const REQUEST_TIMEOUT_MS = 20_000;
const MAX_ATTEMPTS = 2;

const feeds = [
  { name: "PANews", url: "https://www.panewslab.com/rss.xml?lang=zh&type=NEWS" },
  { name: "Cointelegraph", url: "https://cointelegraph.com/rss" },
  { name: "Decrypt", url: "https://decrypt.co/feed" },
  { name: "The Block", url: "https://www.theblock.co/rss.xml" },
  { name: "CoinDesk", url: "https://www.coindesk.com/arc/outboundfeeds/rss/" }
];

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: "",
  cdataPropName: "cdata",
  htmlEntities: true,
  trimValues: true
});

const topicRules = [
  {
    key: "usdt",
    label: "USDT",
    keywords: ["usdt", "tether", "stablecoin", "stablecoins"],
    seoKeyword: "USDT新闻",
    intro: "这条新闻与 USDT、稳定币或链上资金流动相关，适合关注转账、钱包余额和稳定币使用风险的用户阅读。",
    impact:
      "对普通用户来说，重点不在短线价格，而在稳定币发行方、交易平台和链上转账规则是否出现变化。"
  },
  {
    key: "tron",
    label: "TRON",
    keywords: ["tron", "trc20", "justin sun"],
    seoKeyword: "TRON新闻",
    intro: "这条新闻与 TRON 生态、TRC20 资产或链上交易活动相关，适合作为 USDT 地址查询用户的延伸阅读。",
    impact:
      "如果事件涉及 TRC20 USDT、交易费用或网络活动，用户在转账前应额外核对地址、网络和链上确认状态。"
  },
  {
    key: "bitcoin",
    label: "Bitcoin",
    keywords: ["bitcoin", "btc"],
    seoKeyword: "比特币新闻",
    intro: "这条新闻围绕比特币市场、机构持仓或链上数据展开，是观察加密资产整体情绪的重要线索。",
    impact:
      "比特币消息常会影响整个加密市场情绪，但单条新闻不能作为投资依据，仍需要结合链上数据和公开来源交叉判断。"
  },
  {
    key: "ethereum",
    label: "Ethereum",
    keywords: ["ethereum", "ether", "eth", "erc20"],
    seoKeyword: "以太坊新闻",
    intro: "这条新闻与以太坊、ERC20 资产或智能合约生态有关，可帮助用户理解不同网络资产的差异。",
    impact:
      "如果新闻涉及 ERC20 代币或 Gas 费用，转账时要区分 ERC20 与 TRC20，避免把同名资产发到错误网络。"
  },
  {
    key: "defi",
    label: "DeFi",
    keywords: ["defi", "protocol", "lending", "dex", "yield", "staking"],
    seoKeyword: "DeFi新闻",
    intro: "这条新闻涉及 DeFi 协议、链上应用或智能合约资金活动，适合关注钱包授权与链上风险的用户阅读。",
    impact:
      "DeFi 相关事件通常需要重点关注授权、合约风险和资金流向。查询地址时只能看到公开记录，不能直接证明身份或安全结论。"
  },
  {
    key: "security",
    label: "Security",
    keywords: ["hack", "exploit", "phishing", "scam", "security", "stolen", "breach"],
    seoKeyword: "区块链安全新闻",
    intro: "这条新闻与链上安全、攻击事件或资金风险有关，适合作为钱包安全和地址核验的参考资料。",
    impact:
      "遇到安全事件时，不要连接陌生钱包页面，不要签名不明授权，也不要向任何人提供私钥或助记词。"
  }
];

const fallbackTopic = {
  label: "Blockchain",
  seoKeyword: "区块链新闻",
  intro: "这条新闻来自公开区块链媒体，内容与加密资产、链上生态或数字资产市场有关。",
  impact:
    "阅读这类新闻时，应优先核对公开来源、事件时间和链上证据，避免只凭标题判断风险或机会。"
};

const titleTerms = [
  ["Bitcoin", "比特币"],
  ["BTC", "比特币"],
  ["Ethereum", "以太坊"],
  ["Ether", "以太坊"],
  ["ETH", "以太坊"],
  ["USDT", "USDT"],
  ["Tether", "Tether"],
  ["TRON", "TRON"],
  ["TRC20", "TRC20"],
  ["stablecoins", "稳定币"],
  ["stablecoin", "稳定币"],
  ["cryptocurrency", "加密货币"],
  ["crypto", "加密资产"],
  ["blockchain", "区块链"],
  ["wallet", "钱包"],
  ["exchange", "交易所"],
  ["hack", "攻击事件"],
  ["exploit", "漏洞利用"],
  ["DeFi", "DeFi"],
  ["token", "代币"],
  ["tokens", "代币"],
  ["market", "市场"],
  ["price", "价格"],
  ["regulation", "监管"],
  ["SEC", "SEC"]
];

function toArray(value) {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function textValue(value) {
  if (!value) return "";
  if (typeof value === "string") return value;
  if (typeof value === "number") return String(value);
  if (typeof value === "object") {
    if (typeof value.cdata === "string") return value.cdata;
    if (typeof value["#text"] === "string") return value["#text"];
    if (typeof value.href === "string") return value.href;
  }
  return "";
}

function stripHtml(value) {
  return textValue(value)
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanText(value, maxLength = 220) {
  const clean = stripHtml(value);
  if (clean.length <= maxLength) return clean;
  return `${clean.slice(0, maxLength).replace(/[，。,.!！?\s]+$/, "")}...`;
}

function normalizeLink(item) {
  const raw = textValue(item.link) || textValue(item.guid);
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.hash = "";
    return url.toString();
  } catch {
    return raw.trim();
  }
}

function pickTopic(title, summary) {
  const searchable = `${title} ${summary}`.toLowerCase();
  return (
    topicRules.find((topic) =>
      topic.keywords.some((keyword) => searchable.includes(keyword.toLowerCase()))
    ) || fallbackTopic
  );
}

function localizeTitle(title, topic) {
  let localized = title;
  for (const [source, target] of titleTerms) {
    localized = localized.replace(new RegExp(`\\b${source}\\b`, "gi"), target);
  }

  localized = localized.replace(/\s+/g, " ").replace(/[“”"]/g, "").trim();
  if (/[\u4e00-\u9fa5]/.test(localized)) {
    return localized.length > 54 ? `${localized.slice(0, 54)}...` : localized;
  }

  const clipped = localized.length > 68 ? `${localized.slice(0, 68)}...` : localized;
  return `${topic.label} 快讯：${clipped}`;
}

function slugify(title, id, date) {
  const ascii = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 54);
  return `${date.slice(0, 10)}-${ascii || id}`.replace(/-+/g, "-");
}

function buildArticle({ id, title, summary, url, source, publishedAt }) {
  const topic = pickTopic(title, summary);
  const chineseTitle = localizeTitle(title, topic);
  const dateText = new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(new Date(publishedAt));
  const sourceSummary = cleanText(summary || title, 260);
  const excerpt = `${topic.intro} 本文根据 ${source} 于 ${dateText} 发布的公开信息整理，提供中文摘要、关键信息和阅读提示。`;
  const seoDescription =
    `${chineseTitle}。查U地址每周自动整理区块链新闻，提供中文摘要、要点、影响解读和原文来源，适合关注USDT、钱包与链上安全的用户。`;

  return {
    id,
    slug: slugify(title, id, publishedAt),
    title: chineseTitle,
    originalTitle: title,
    seoTitle: `${chineseTitle} | ${topic.seoKeyword}`,
    seoDescription: seoDescription.slice(0, 155),
    excerpt,
    topic: topic.label,
    keyword: topic.seoKeyword,
    source,
    sourceUrl: url,
    publishedAt,
    readTime: "约 3 分钟",
    summary: sourceSummary,
    sections: [
      {
        title: "新闻概览",
        paragraphs: [
          `${source} 发布的这条消息提到：${sourceSummary}`,
          "查U地址将这类公开消息整理为中文站内文章，方便中文用户快速了解事件背景，并保留原文链接用于继续核对。"
        ]
      },
      {
        title: "关键信息",
        points: [
          `主题方向：${topic.seoKeyword}`,
          `信息来源：${source}`,
          `发布时间：${dateText}`,
          "建议结合原文、链上浏览器和官方公告交叉确认"
        ]
      },
      {
        title: "对 USDT 与链上查询用户的参考意义",
        paragraphs: [
          topic.impact,
          "如果新闻涉及交易所、钱包、稳定币或安全事件，用户查询地址时应重点核对交易方向、金额、时间、交易哈希和网络类型。本站只读取公开链上数据，不保存查询历史，也不要求连接钱包。"
        ]
      }
    ],
    faq: [
      {
        question: "这篇文章是原文全文翻译吗？",
        answer:
          "不是。本站不会复制外媒全文，而是根据公开 RSS 信息生成中文摘要、要点和阅读提示，并保留原文链接，方便用户核对来源。"
      },
      {
        question: "新闻能证明某个地址安全吗？",
        answer:
          "不能。新闻和链上记录只能提供参考，不能单独证明地址所有者身份、资金来源或合规结论。涉及转账时仍要核对完整地址、网络和官方来源。"
      }
    ]
  };
}

function normalizeItem(item, source) {
  const title = stripHtml(item.title);
  const url = normalizeLink(item);
  const publishedAt = new Date(
    textValue(item.pubDate) ||
      textValue(item.published) ||
      textValue(item.updated) ||
      Date.now()
  );
  const summary = cleanText(
    item.description || item.summary || item["content:encoded"] || "",
    320
  );

  if (!title || !url || Number.isNaN(publishedAt.getTime())) return null;

  const id = createHash("sha256").update(`${source.name}:${url}`).digest("hex").slice(0, 16);
  return buildArticle({
    id,
    title,
    summary,
    url,
    source: source.name,
    publishedAt: publishedAt.toISOString()
  });
}

async function fetchFeed(source) {
  try {
    let response;
    let lastError;
    for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt += 1) {
      try {
        response = await fetch(source.url, {
          headers: {
            Accept: "application/rss+xml, application/xml, text/xml;q=0.9, */*;q=0.8",
            "User-Agent": "chaU-news-fetcher/2.0 (+https://github.com/lg-list/chaU)"
          },
          signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS)
        });
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!response) {
      throw lastError instanceof Error ? lastError : new Error(String(lastError));
    }

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const xml = await response.text();
    const parsed = parser.parse(xml);
    const channelItems = toArray(parsed.rss?.channel?.item);
    const atomItems = toArray(parsed.feed?.entry);
    return [...channelItems, ...atomItems].map((item) => normalizeItem(item, source)).filter(Boolean);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`${source.name}: ${message}`);
  }
}

async function main() {
  const settled = await Promise.allSettled(feeds.map(fetchFeed));
  const errors = settled
    .filter((result) => result.status === "rejected")
    .map((result) => (result.reason instanceof Error ? result.reason.message : String(result.reason)));
  const items = settled
    .filter((result) => result.status === "fulfilled")
    .flatMap((result) => result.value);

  const seen = new Set();
  const articles = items
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .filter((item) => {
      const key = item.sourceUrl || item.title;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, MAX_ITEMS);

  if (!articles.length) {
    throw new Error(`No news articles fetched. Errors: ${errors.join("; ")}`);
  }

  const payload = {
    generatedAt: new Date().toISOString(),
    language: "zh-CN",
    updateFrequency: "weekly",
    copyrightNote:
      "本站根据公开 RSS 标题与摘要生成中文摘要和解读，不复制来源网站全文；每篇文章均保留原文链接。",
    sources: feeds.map(({ name, url }) => ({ name, url })),
    errors,
    items: articles
  };

  await mkdir(dirname(OUTPUT_PATH), { recursive: true });
  await writeFile(OUTPUT_PATH, `${JSON.stringify(payload, null, 2)}\n`);

  console.log(`Wrote ${articles.length} Chinese blockchain articles to ${OUTPUT_PATH}`);
  if (errors.length) {
    console.warn(`Skipped ${errors.length} failed feed(s): ${errors.join("; ")}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
