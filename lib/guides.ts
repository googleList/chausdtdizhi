export type GuideSection = {
  title: string;
  paragraphs?: string[];
  points?: string[];
};

export type Guide = {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  eyebrow: string;
  readTime: string;
  summary: string;
  sections: GuideSection[];
  faq: Array<{ question: string; answer: string }>;
  sources: Array<{ label: string; href: string }>;
};

export const guides: Guide[] = [
  {
    slug: "what-is-trc20-address",
    title: "TRC20 地址是什么？格式、用途与查询方法",
    shortTitle: "TRC20 地址是什么",
    description:
      "了解TRC20地址格式、用途、如何识别TRON地址，以及查询USDT余额和交易记录的方法。",
    eyebrow: "TRC20 入门",
    readTime: "约 4 分钟",
    summary:
      "TRC20 地址是 TRON 网络账户的公开标识，常用于接收和发送 TRC20 USDT。它通常以大写字母 T 开头，但转账前仍需核对网络、完整地址和币种。",
    sections: [
      {
        title: "TRC20 地址长什么样？",
        paragraphs: [
          "常见的 TRON Base58 地址由 34 个字符组成，通常以 T 开头。地址可以公开用于收款和链上查询，但控制地址资产需要对应私钥签名。",
          "只看首字母不能证明地址安全。复制地址后，应核对完整字符串，避免把相似地址或其他网络地址当作收款地址。"
        ]
      },
      {
        title: "TRC20 地址能查到什么？",
        points: [
          "TRX 与 TRC20 代币余额",
          "USDT 转入、转出金额与时间",
          "交易哈希、发送方和接收方",
          "地址首次活动时间与公开链上记录"
        ]
      },
      {
        title: "如何查询 TRC20 USDT 地址？",
        paragraphs: [
          "将公开地址粘贴到查U地址首页，系统会从 TRON 主网读取已确认的 USDT 余额、TRX 余额和最近交易。查询不需要连接钱包，也不需要输入私钥或助记词。",
          "如果查询不到记录，先确认地址属于 TRON 网络，并检查交易是否已经广播和确认。"
        ]
      }
    ],
    faq: [
      {
        question: "TRC20 地址和 TRON 地址是同一个吗？",
        answer:
          "日常使用中，两者通常指同一个 TRON 账户地址。TRC20 代币通过智能合约记录在该 TRON 地址下。"
      },
      {
        question: "公开钱包地址安全吗？",
        answer:
          "公开地址本身可用于收款和查询。私钥、助记词、验证码和签名授权才是必须严格保密的敏感信息。"
      }
    ],
    sources: [
      {
        label: "TRON Developer Hub：Accounts",
        href: "https://developers.tron.network/docs/account"
      },
      {
        label: "TRON Developer Hub：Blockchain Browsers",
        href: "https://developers.tron.network/docs/data-and-analysis-blockchain-browser"
      }
    ]
  },
  {
    slug: "trc20-vs-erc20",
    title: "TRC20 和 ERC20 有什么区别？USDT 转账网络指南",
    shortTitle: "TRC20 与 ERC20 区别",
    description:
      "对比USDT的TRC20和ERC20网络、地址格式、手续费资源和转账注意事项，避免选错网络。",
    eyebrow: "网络对比",
    readTime: "约 5 分钟",
    summary:
      "TRC20 USDT 运行在 TRON 网络，ERC20 USDT 运行在 Ethereum 网络。它们代表同类资产的不同链上版本，地址格式、网络资源和浏览器都不同，不能直接跨网络转账。",
    sections: [
      {
        title: "最直观的区别",
        points: [
          "TRC20 地址通常以 T 开头，使用 TRON 网络",
          "ERC20 地址通常以 0x 开头，使用 Ethereum 网络",
          "TRC20 转账消耗 TRON 的带宽与能量，资源不足时消耗 TRX",
          "ERC20 转账使用 ETH 支付 Gas"
        ]
      },
      {
        title: "为什么不能只看 USDT 名称？",
        paragraphs: [
          "Tether 官方支持多个区块链协议。虽然不同网络上的代币都叫 USDT，但链上合约和结算网络并不相同。",
          "提现或充值时，发送方与接收方必须选择同一网络。选错网络可能导致平台无法自动入账，甚至造成资产损失。"
        ]
      },
      {
        title: "转账前的检查顺序",
        points: [
          "确认收款平台明确支持 TRC20 或 ERC20",
          "核对地址格式与所选网络是否一致",
          "确认钱包中有对应网络的手续费资产",
          "大额转账前先进行小额测试"
        ]
      }
    ],
    faq: [
      {
        question: "TRC20 USDT 能直接转到 ERC20 地址吗？",
        answer:
          "不能按普通转账方式直接跨链。必须通过支持跨链的正规平台或桥，并仔细核对目标网络。"
      },
      {
        question: "TRC20 转账为什么需要 TRX？",
        answer:
          "TRC20 合约调用会消耗带宽和能量。账户资源不足时，TRON 网络会燃烧 TRX 支付所需资源。"
      }
    ],
    sources: [
      {
        label: "Tether：Supported Protocols",
        href: "https://tether.to/en/supported-protocols/"
      },
      {
        label: "TRON Developer Hub：Resource Model",
        href: "https://developers.tron.network/docs/resource-model"
      }
    ]
  },
  {
    slug: "usdt-transfer-pending",
    title: "USDT 转账未到账怎么办？TRC20 交易查询步骤",
    shortTitle: "USDT 转账未到账",
    description:
      "TRC20 USDT转账未到账时，按交易哈希、地址、确认状态、网络和平台入账规则逐步排查。",
    eyebrow: "到账排查",
    readTime: "约 5 分钟",
    summary:
      "钱包显示已发送，不等于收款平台已经入账。排查时应先确认交易是否广播、链上是否成功、收款地址是否正确，再检查平台确认数、最低充值额和维护状态。",
    sections: [
      {
        title: "第一步：找到交易哈希",
        paragraphs: [
          "交易哈希又称 TxID，是一笔链上交易的唯一标识。打开转出钱包或交易所记录，复制 TxID 后到 TRONSCAN 核对交易状态。",
          "如果没有 TxID，交易可能尚未成功广播。此时应先查看发送平台的订单状态，而不是重复发起转账。"
        ]
      },
      {
        title: "第二步：核对链上状态",
        points: [
          "确认交易结果是否成功",
          "核对发送地址、接收地址和 USDT 金额",
          "确认使用的是 TRON TRC20 网络",
          "等待交易所在链上达到平台要求的确认条件"
        ]
      },
      {
        title: "链上成功但平台未到账",
        paragraphs: [
          "链上成功后仍可能因为充值维护、低于最低充值额、缺少备注要求或平台风控而延迟入账。保存 TxID 和充值截图，联系收款平台客服处理。",
          "不要为了催促到账再次向同一地址转账，也不要向自称客服的人提供私钥、助记词或远程控制权限。"
        ]
      }
    ],
    faq: [
      {
        question: "TRON 交易多久算确认？",
        answer:
          "TRON 官方说明，包含交易的区块在后续获得足够的超级代表区块确认后，交易才被视为已确认。平台入账时间还取决于其自身规则。"
      },
      {
        question: "没有交易哈希可以查询吗？",
        answer:
          "可以按发送或接收地址查看最近记录，但 TxID 是定位单笔交易最准确的方式。"
      }
    ],
    sources: [
      {
        label: "TRON Developer Hub：Transactions",
        href: "https://developers.tron.network/docs/tron-protocol-transaction"
      },
      {
        label: "TRON Developer Hub：TRC-20 Contract Interaction",
        href: "https://developers.tron.network/docs/trc20-contract-interaction"
      }
    ]
  },
  {
    slug: "usdt-address-safety",
    title: "USDT 地址安全检查指南：转账前必须核对的 7 件事",
    shortTitle: "USDT 地址安全检查",
    description:
      "USDT转账前的地址安全检查清单，帮助识别错链、相似地址、地址投毒和虚假授权风险。",
    eyebrow: "安全指南",
    readTime: "约 6 分钟",
    summary:
      "公开链上记录可以帮助核对交易，但不能单独证明一个地址可信。转账安全依赖完整地址核验、网络确认、小额测试、授权检查和对私钥信息的保护。",
    sections: [
      {
        title: "转账前的 7 项检查",
        points: [
          "从可信渠道获取收款地址",
          "核对完整地址，不只看开头和结尾",
          "确认发送与接收平台选择同一网络",
          "检查币种和合约是否正确",
          "大额转账前先发小额测试",
          "不要从陌生小额转账记录中复制地址",
          "拒绝任何索要私钥、助记词或无限授权的请求"
        ]
      },
      {
        title: "什么是相似地址与地址投毒？",
        paragraphs: [
          "攻击者可能生成首尾字符与常用地址相似的地址，并通过小额转账让它出现在交易历史中。如果用户只核对首尾字符，就可能复制错误地址。",
          "最稳妥的方法是从可信来源重新获取地址，并逐段核对完整字符串。钱包地址簿也应在首次保存时完成验证。"
        ]
      },
      {
        title: "链上查询能做什么，不能做什么？",
        paragraphs: [
          "链上查询可以验证余额、历史转账、交易时间和资金方向，但普通浏览器数据不能自动判断资金是否合法，也不能保证交易对手身份真实。",
          "涉及来源审查、制裁名单、案件关联或反洗钱判断时，需要有可靠标签库和专业合规服务，不能只凭交易频率或金额下结论。"
        ]
      }
    ],
    faq: [
      {
        question: "查到很多交易就代表地址安全吗？",
        answer:
          "不代表。交易数量只能说明地址活跃程度，不能证明地址所有者身份或资金来源合法。"
      },
      {
        question: "查询地址需要钱包授权吗？",
        answer:
          "不需要。查看公开链上数据只需要地址。任何要求签名或授权的查询页面都应谨慎对待。"
      }
    ],
    sources: [
      {
        label: "TRON Developer Hub：Transaction Signature Validation",
        href: "https://developers.tron.network/docs/transaction-signature-validation"
      },
      {
        label: "TRON Developer Hub：Blockchain Browsers",
        href: "https://developers.tron.network/docs/data-and-analysis-blockchain-browser"
      }
    ]
  }
];

export function getGuide(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}
