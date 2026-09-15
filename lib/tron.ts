export const USDT_CONTRACT = "TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t";
export const TRONGRID_BASE_URL = "https://api.trongrid.io";

const TRON_ADDRESS_PATTERN = /^T[1-9A-HJ-NP-Za-km-z]{33}$/;

export type Direction = "all" | "in" | "out";

export type TronGridAccount = {
  address?: string;
  balance?: number;
  create_time?: number;
  latest_opration_time?: number;
  trc20?: Array<Record<string, string>>;
};

export type TronGridTransaction = {
  transaction_id: string;
  block_timestamp: number;
  from: string;
  to: string;
  type: string;
  value: string;
  token_info: {
    symbol: string;
    address: string;
    decimals: number;
    name: string;
  };
};

export type AddressResult = {
  address: string;
  activatedAt: number | null;
  updatedAt: number | null;
  trxBalance: number;
  usdtBalance: number;
  cnyRate: number | null;
  cnyRateUpdatedAt: number | null;
  transactions: Array<{
    id: string;
    timestamp: number;
    from: string;
    to: string;
    amount: number;
    direction: "in" | "out";
  }>;
  nextFingerprint: string | null;
};

export function isValidTronAddress(value: string): boolean {
  return TRON_ADDRESS_PATTERN.test(value.trim());
}

export function normalizeDirection(value: string | null): Direction {
  return value === "in" || value === "out" ? value : "all";
}

export function parseUsdtBalance(account?: TronGridAccount): number {
  if (!account?.trc20) return 0;

  for (const entry of account.trc20) {
    const raw = entry[USDT_CONTRACT];
    if (raw !== undefined) return Number(raw) / 1_000_000;
  }

  return 0;
}

export function mapTransactions(
  address: string,
  transactions: TronGridTransaction[],
  direction: Direction
): AddressResult["transactions"] {
  return transactions
    .map((transaction) => ({
      id: transaction.transaction_id,
      timestamp: transaction.block_timestamp,
      from: transaction.from,
      to: transaction.to,
      amount:
        Number(transaction.value) /
        10 ** Number(transaction.token_info.decimals || 6),
      direction: transaction.to === address ? ("in" as const) : ("out" as const)
    }))
    .filter(
      (transaction) =>
        direction === "all" || transaction.direction === direction
    );
}
