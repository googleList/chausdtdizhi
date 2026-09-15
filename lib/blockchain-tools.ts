export type BlockchainTool = {
  slug: string;
  name: string;
  category: string;
  title: string;
  description: string;
  useCase: string;
  href: string;
  isInternal: boolean;
  readTime: string;
  steps: string[];
  tips: string[];
  faq: Array<{ question: string; answer: string }>;
  relatedGuides: Array<{ label: string; href: string }>;
};

export const blockchainTools: BlockchainTool[] = [
  {
    slug: "usdt-address-query",
    name: "USDT 地址查询",
    category: "本站工具",
    title: "USDT 地址查询工具使用教程：查余额、交易记录与转入转出",
    description:
      "使用查U地址查询TRON网络USDT余额、TRX余额、最近交易记录、转入转出方向与交易哈希，无需登录、无需连接钱包。",
    useCase: "查询 TRC20 USDT 地址余额、交易方向和最近链上记录。",
    href: "/",
    isInternal: true,
    readTime: "约 4 分钟",
    steps: [
      "复制需要查询的 TRON 地址，通常以 T 开头。",
      "打开查U地址首页，将地址粘贴到输入框。",
      "点击查询，查看 USDT 余额、TRX 余额、最近转入转出记录。",
      "如需核对单笔交易，可复制交易哈希到 TRONSCAN 继续查看。"
    ],
    tips: [
      "本站只读取公开链上数据，不需要连接钱包或签名授权。",
      "转账前应核对完整地址，不要只看开头和结尾。",
      "链上活跃不等于地址安全，交易记录只能作为参考。"
    ],
    faq: [
      {
        question: "查询 USDT 地址需要登录吗？",
        answer: "不需要。输入公开地址即可查询链上公开数据，本站不保存查询历史。"
      },
      {
        question: "能查询 ERC20 USDT 吗？",
        answer: "当前工具聚焦 TRON/TRC20 网络。ERC20 地址通常以 0x 开头，需要使用以太坊浏览器核对。"
      }
    ],
    relatedGuides: [
      { label: "TRC20 地址是什么", href: "/guides/what-is-trc20-address" },
      { label: "USDT 地址安全检查", href: "/guides/usdt-address-safety" }
    ]
  },
  {
    slug: "tronscan",
    name: "TRONSCAN",
    category: "链上浏览器",
    title: "TRONSCAN 使用教程：查询 TRC20 USDT 交易哈希与地址记录",
    description:
      "TRONSCAN是TRON官方生态常用区块浏览器，可查询TRC20 USDT交易、区块、合约、地址余额和链上确认状态。",
    useCase: "核对 TRON 地址、交易哈希、合约与区块确认状态。",
    href: "https://tronscan.org",
    isInternal: false,
    readTime: "约 5 分钟",
    steps: [
      "打开 TRONSCAN，在搜索框输入 TRON 地址或交易哈希。",
      "进入地址页后查看资产列表、TRC20 转账和交易时间。",
      "进入交易详情页后核对 From、To、Amount、Status 和 Block。",
      "与钱包或交易所记录对比，确认网络、金额和接收地址一致。"
    ],
    tips: [
      "TRONSCAN 显示的是公开链上记录，不代表平台已经完成入账。",
      "遇到未到账问题，优先保存交易哈希和截图。",
      "不要通过陌生链接连接钱包，查询公开数据不需要授权。"
    ],
    faq: [
      {
        question: "TRONSCAN 上成功就一定到账了吗？",
        answer: "不一定。链上成功后，交易所或收款平台还可能有确认数、维护、风控或最低充值额要求。"
      },
      {
        question: "没有交易哈希能查吗？",
        answer: "可以用地址查询最近记录，但定位单笔交易时，交易哈希最准确。"
      }
    ],
    relatedGuides: [
      { label: "USDT 转账未到账怎么办", href: "/guides/usdt-transfer-pending" },
      { label: "TRC20 和 ERC20 区别", href: "/guides/trc20-vs-erc20" }
    ]
  },
  {
    slug: "tether-transparency",
    name: "Tether Transparency",
    category: "稳定币资料",
    title: "Tether 透明度页面怎么看：USDT 发行网络与储备信息说明",
    description:
      "Tether Transparency可用于了解USDT在不同网络上的发行规模、授权数量和公开透明度信息，适合做稳定币资料核对。",
    useCase: "查看 USDT 多链发行信息和 Tether 官方透明度资料。",
    href: "https://tether.to/en/transparency/",
    isInternal: false,
    readTime: "约 4 分钟",
    steps: [
      "打开 Tether Transparency 页面。",
      "查看 USDT 在不同区块链网络上的发行与授权数据。",
      "结合 Tether 公告和链上浏览器核对具体网络信息。",
      "需要转账时，再回到钱包或交易所确认所选网络。"
    ],
    tips: [
      "USDT 是多链资产，同名代币不代表同一条网络。",
      "TRC20 USDT 与 ERC20 USDT 的地址格式和手续费资产不同。",
      "官方透明度信息适合做背景核对，不替代链上单笔交易查询。"
    ],
    faq: [
      {
        question: "Tether 页面能查个人地址余额吗？",
        answer: "不能。个人地址余额需要用对应网络的链上浏览器或本站 TRON 地址查询工具。"
      },
      {
        question: "看到 USDT 支持多个网络，转账时怎么选？",
        answer: "发送方和接收方必须选择同一网络。充值交易所时，以交易所充值页面显示的网络为准。"
      }
    ],
    relatedGuides: [
      { label: "TRC20 和 ERC20 区别", href: "/guides/trc20-vs-erc20" },
      { label: "TRC20 地址是什么", href: "/guides/what-is-trc20-address" }
    ]
  },
  {
    slug: "revoke-approval-check",
    name: "钱包授权检查",
    category: "安全工具",
    title: "钱包授权检查教程：为什么要定期检查代币授权",
    description:
      "了解钱包授权检查的作用、适用场景和安全注意事项，避免不明合约长期拥有代币转移权限。",
    useCase: "检查钱包是否给陌生合约授权过代币额度。",
    href: "https://revoke.cash",
    isInternal: false,
    readTime: "约 5 分钟",
    steps: [
      "确认自己要检查的是哪条网络和哪个钱包地址。",
      "打开可信的授权检查工具，仔细核对域名。",
      "查看是否存在陌生、长期不用或额度异常的授权。",
      "撤销授权前确认网络手续费和合约信息，避免误操作。"
    ],
    tips: [
      "公开地址查询不需要连接钱包，撤销授权才可能需要钱包签名。",
      "不要通过群聊、私信或广告里的链接进入授权页面。",
      "如果不理解某个签名请求，宁可先取消。"
    ],
    faq: [
      {
        question: "查 USDT 地址需要撤销授权吗？",
        answer: "不需要。本站地址查询只读取公开数据，不涉及钱包连接和授权撤销。"
      },
      {
        question: "授权是不是一定危险？",
        answer: "不是。授权是 DeFi 常见操作，但陌生、无限额度、长期不用的授权需要谨慎检查。"
      }
    ],
    relatedGuides: [
      { label: "USDT 地址安全检查", href: "/guides/usdt-address-safety" },
      { label: "USDT 转账未到账怎么办", href: "/guides/usdt-transfer-pending" }
    ]
  }
];

export function getBlockchainTool(slug: string) {
  return blockchainTools.find((tool) => tool.slug === slug);
}
