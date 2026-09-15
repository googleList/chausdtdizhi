"use client";

import {
  ArrowDownLeft,
  ArrowSquareOut,
  ArrowUpRight,
  CalendarBlank,
  Check,
  Coins,
  Copy,
  CurrencyCny,
  MagnifyingGlass,
  Pulse,
  SpinnerGap,
  Wallet,
  WarningCircle
} from "@phosphor-icons/react";
import { FormEvent, useEffect, useMemo, useState } from "react";
import type { AddressResult, Direction } from "@/lib/tron";
import { isValidTronAddress } from "@/lib/tron";
import { fetchAddressData } from "@/lib/tron-client";

function compact(value: string, start = 7, end = 6) {
  return `${value.slice(0, start)}...${value.slice(-end)}`;
}

function formatNumber(value: number, maximumFractionDigits = 6) {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 0,
    maximumFractionDigits
  }).format(value);
}

function formatBalance(value: number) {
  return new Intl.NumberFormat("zh-CN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}

function formatDate(value: number | null) {
  if (!value) return "未激活";
  return new Intl.DateTimeFormat("zh-CN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  }).format(value);
}

type FetchOptions = {
  append?: boolean;
  fingerprint?: string | null;
  direction?: Direction;
};

export function AddressExplorer() {
  const [input, setInput] = useState("");
  const [address, setAddress] = useState("");
  const [result, setResult] = useState<AddressResult | null>(null);
  const [direction, setDirection] = useState<Direction>("all");
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState("");

  const totals = useMemo(() => {
    if (!result) return { incoming: 0, outgoing: 0 };
    return result.transactions.reduce(
      (sum, transaction) => {
        sum[transaction.direction === "in" ? "incoming" : "outgoing"] +=
          transaction.amount;
        return sum;
      },
      { incoming: 0, outgoing: 0 }
    );
  }, [result]);
  const usdtBalance = result ? formatBalance(result.usdtBalance) : "";
  const trxBalance = result ? formatBalance(result.trxBalance) : "";

  useEffect(() => {
    if (!copied) return;
    const timeout = window.setTimeout(() => setCopied(""), 1400);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  async function fetchAddress(
    nextAddress: string,
    options: FetchOptions = {}
  ) {
    const nextDirection = options.direction ?? direction;
    if (options.append) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    setError("");

    try {
      const payload = await fetchAddressData(nextAddress, {
        direction: nextDirection,
        fingerprint: options.fingerprint
      });

      setResult((current) =>
        options.append && current
          ? {
              ...payload,
              transactions: [
                ...current.transactions,
                ...payload.transactions.filter(
                  (transaction) =>
                    !current.transactions.some(
                      (existing) => existing.id === transaction.id
                    )
                )
              ]
            }
          : payload
      );
      setAddress(nextAddress);
      setDirection(nextDirection);

    } catch (fetchError) {
      const isTimeout =
        fetchError instanceof Error &&
        (fetchError.name === "TimeoutError" ||
          fetchError.name === "AbortError");
      setError(
        isTimeout
          ? "链上数据响应超时，请稍后重试。"
          : "暂时无法读取链上数据，请稍后重试。"
      );
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextAddress = input.trim();
    if (!isValidTronAddress(nextAddress)) {
      setError("请输入以 T 开头的有效 TRON 地址。");
      return;
    }
    void fetchAddress(nextAddress, { direction: "all" });
  }

  function changeDirection(nextDirection: Direction) {
    if (!address || nextDirection === direction) return;
    void fetchAddress(address, { direction: nextDirection });
  }

  async function copyText(value: string) {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = value;
      textarea.style.position = "fixed";
      textarea.style.opacity = "0";
      document.body.appendChild(textarea);
      textarea.focus();
      textarea.select();
      document.execCommand("copy");
      textarea.remove();
    }
    setCopied(value);
  }

  return (
    <div className="explorer-shell">
      <form className="search-form" onSubmit={submit} noValidate>
        <label htmlFor="tron-address">TRON 地址</label>
        <div className="search-row">
          <div className="input-wrap">
            <MagnifyingGlass size={21} weight="regular" aria-hidden="true" />
            <input
              id="tron-address"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="输入以 T 开头的 TRON 地址"
              autoComplete="off"
              spellCheck={false}
              aria-describedby={error ? "search-error" : undefined}
            />
          </div>
          <button className="primary-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <SpinnerGap className="spin" size={20} aria-hidden="true" />
                查询中
              </>
            ) : (
              <>
                <MagnifyingGlass size={19} weight="bold" aria-hidden="true" />
                查询地址
              </>
            )}
          </button>
        </div>
        <div className="search-meta">
          <span>支持 TRC20 USDT 地址</span>
        </div>
        {error && (
          <p className="form-error" id="search-error" role="alert">
            <WarningCircle size={18} weight="fill" aria-hidden="true" />
            {error}
          </p>
        )}
      </form>

      {loading && !result && <ResultSkeleton />}

      {result && (
        <section className="results" aria-live="polite">
          <div className="result-heading">
            <div>
              <p>查询地址</p>
              <div className="address-line">
                <h2>{compact(result.address, 10, 9)}</h2>
                <button
                  className="icon-button"
                  type="button"
                  aria-label="复制完整地址"
                  onClick={() => void copyText(result.address)}
                >
                  {copied === result.address ? (
                    <Check size={18} weight="bold" />
                  ) : (
                    <Copy size={18} />
                  )}
                </button>
                <a
                  className="icon-button"
                  href={`https://tronscan.org/#/address/${result.address}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="在 TRONSCAN 打开"
                >
                  <ArrowSquareOut size={18} />
                </a>
              </div>
            </div>
            <span className="confirmed-badge">
              <Check size={14} weight="bold" />
              已确认数据
            </span>
          </div>

          <div className="metrics">
            <article className="metric metric-primary">
              <span className="metric-label">
                <Coins size={17} weight="duotone" />
                USDT 余额
              </span>
              <strong
                className={`metric-balance ${usdtBalance.length >= 13 ? "is-long" : ""}`}
                title={usdtBalance}
              >
                {usdtBalance}
              </strong>
              <small>TRC20 USDT</small>
            </article>
            <article className="metric">
              <span className="metric-label">
                <Wallet size={17} weight="duotone" />
                TRX 余额
              </span>
              <strong
                className={`metric-balance ${trxBalance.length >= 13 ? "is-long" : ""}`}
                title={trxBalance}
              >
                {trxBalance}
              </strong>
              <small>用于支付网络资源</small>
            </article>
            <article className="metric">
              <span className="metric-label">
                <CalendarBlank size={17} weight="duotone" />
                地址激活时间
              </span>
              <strong className="metric-date">
                {formatDate(result.activatedAt)}
              </strong>
              <small>首次链上活动</small>
            </article>
            <article className="metric metric-cny">
              <span className="metric-label">
                <CurrencyCny size={17} weight="duotone" />
                约合人民币
              </span>
              <strong>
                {result.cnyRate
                  ? `¥${formatNumber(result.usdtBalance * result.cnyRate, 2)}`
                  : "暂不可用"}
              </strong>
              <small>
                {result.cnyRate
                  ? `参考汇率 1 USDT ≈ ¥${formatNumber(result.cnyRate, 4)}`
                  : "汇率服务暂未响应"}
              </small>
            </article>
          </div>

          <div className="transaction-section">
            <div className="transaction-toolbar">
              <div>
                <h3>
                  <Pulse size={20} weight="duotone" />
                  最近 USDT 转账
                </h3>
                <p>当前已加载记录的收支汇总，不代表地址历史总额</p>
              </div>
              <div className="filters" aria-label="筛选交易方向">
                {(
                  [
                    ["all", "全部"],
                    ["in", "转入"],
                    ["out", "转出"]
                  ] as const
                ).map(([value, label]) => (
                  <button
                    type="button"
                    className={direction === value ? "active" : ""}
                    aria-pressed={direction === value}
                    onClick={() => changeDirection(value)}
                    key={value}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="summary-row">
              <span>
                已加载转入{" "}
                <strong className="incoming-total">
                  +{formatNumber(totals.incoming, 2)}
                </strong>
              </span>
              <span>
                已加载转出 <strong>-{formatNumber(totals.outgoing, 2)}</strong>
              </span>
              <span>
                共 <strong>{result.transactions.length}</strong> 笔
              </span>
            </div>

            {result.transactions.length ? (
              <>
                <div className="table-scroll">
                  <table>
                    <thead>
                      <tr>
                        <th>方向</th>
                        <th>金额</th>
                        <th>对方地址</th>
                        <th>时间</th>
                        <th>交易哈希</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.transactions.map((transaction) => {
                        const incoming = transaction.direction === "in";
                        const counterparty = incoming
                          ? transaction.from
                          : transaction.to;
                        return (
                          <tr key={transaction.id}>
                            <td>
                              <span
                                className={`direction ${transaction.direction}`}
                              >
                                {incoming ? (
                                  <ArrowDownLeft size={16} weight="bold" />
                                ) : (
                                  <ArrowUpRight size={16} weight="bold" />
                                )}
                                {incoming ? "转入" : "转出"}
                              </span>
                            </td>
                            <td
                              className={`amount ${transaction.direction}`}
                            >
                              {incoming ? "+" : "-"}
                              {formatNumber(transaction.amount, 6)}
                            </td>
                            <td>
                              <button
                                className="mono-link mono-copy"
                                type="button"
                                onClick={() => void copyText(counterparty)}
                                aria-label={`复制对方地址 ${counterparty}`}
                                title={counterparty}
                              >
                                {compact(counterparty)}
                                {copied === counterparty ? (
                                  <Check size={14} weight="bold" aria-hidden="true" />
                                ) : (
                                  <Copy size={14} aria-hidden="true" />
                                )}
                              </button>
                            </td>
                            <td>{formatDate(transaction.timestamp)}</td>
                            <td>
                              <a
                                className="mono-link"
                                href={`https://tronscan.org/#/transaction/${transaction.id}`}
                                target="_blank"
                                rel="noreferrer"
                                title={transaction.id}
                              >
                                {compact(transaction.id)}
                              </a>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {result.nextFingerprint && (
                  <button
                    className="load-more"
                    type="button"
                    disabled={loadingMore}
                    onClick={() =>
                      void fetchAddress(address, {
                        append: true,
                        fingerprint: result.nextFingerprint
                      })
                    }
                  >
                    {loadingMore ? (
                      <>
                        <SpinnerGap className="spin" size={18} />
                        加载中
                      </>
                    ) : (
                      "加载更多记录"
                    )}
                  </button>
                )}
              </>
            ) : (
              <div className="empty-state">
                <MagnifyingGlass size={28} />
                <strong>没有找到符合条件的 USDT 转账</strong>
                <p>可切换筛选条件，或确认该地址是否发生过 TRC20 USDT 转账。</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

function ResultSkeleton() {
  return (
    <div className="result-skeleton" aria-label="正在读取链上数据">
      <span />
      <div>
        <span />
        <span />
        <span />
      </div>
      <span />
      <span />
      <span />
    </div>
  );
}
