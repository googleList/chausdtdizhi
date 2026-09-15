# 链迹

一个可部署到 GitHub Pages 的 TRON USDT 地址查询网站。输入 TRON 地址后，可查看：

- TRC20 USDT 余额
- USDT 人民币参考估值
- TRX 余额
- 地址激活时间
- 最近确认的 USDT 转入与转出记录
- 交易分页和 TRONSCAN 核验链接

数据来自 TRON 官方 TronGrid 主网 API。网站只读取公开链上数据，不接触钱包、私钥或授权。

## 本地运行

需要 Node.js 20.9 或更高版本。

```bash
npm install
cp .env.example .env.local
npm run dev
```

打开 `http://localhost:3000`。

## 环境变量

公开 TronGrid API 不配置密钥也可使用，但限流较低。可选在
[TronGrid](https://www.trongrid.io/) 申请 API Key：

```env
NEXT_PUBLIC_TRONGRID_API_KEY=your_key
NEXT_PUBLIC_SITE_URL=https://your-domain.com
GOOGLE_SITE_VERIFICATION=your_google_token
```

GitHub Pages 是纯静态托管，因此该 Key 会被打包到浏览器代码中。它不是钱包私钥，
但任何访客都可以查看和使用它。若不接受公开，请不要配置。

`NEXT_PUBLIC_SITE_URL` 用于生成 Google 可识别的 canonical、`robots.txt`
和 `sitemap.xml`。绑定正式域名后必须填写实际 HTTPS 地址。

## 部署到 GitHub Pages

1. 在 GitHub 创建仓库并推送本项目。
2. 打开仓库的 `Settings` → `Pages`。
3. 将 `Build and deployment` 的 Source 设为 `GitHub Actions`。
4. 推送到 `main` 或 `master` 分支。
5. 等待 `Deploy to GitHub Pages` 工作流完成。

工作流会自动识别普通项目仓库的子路径，例如：

```text
https://用户名.github.io/仓库名/
```

查询请求由访客浏览器直接发送到 TronGrid 和公开汇率 API，不需要服务器。

如需使用 API Key，在仓库 `Settings` → `Secrets and variables` → `Actions`
中添加名为 `TRONGRID_API_KEY` 的 Secret。该值最终仍会公开在前端代码中。

## 自动化

- `ci.yml`：运行测试、ESLint 和静态生产构建。
- `pages.yml`：构建 `out` 目录并发布到 GitHub Pages。

## 上线检查

- 绑定正式域名并启用 HTTPS。
- 确认浏览器可以直接访问 TronGrid API。
- 在 Vercel Analytics 或其他平台添加隐私友好的访问统计。
- 根据实际运营主体补充隐私政策、服务条款与备案信息。
- 如面向中国大陆用户提供服务，按服务器所在地和业务性质确认备案及合规要求。

## 说明

余额和转账数据以 TRON 主网最新已确认区块为准。页面中的收支汇总仅统计当前已加载的记录，不代表地址完整历史总额。
