import {
  AddressResult,
  Direction,
  mapTransactions,
  parseUsdtBalance,
  TRONGRID_BASE_URL,
  TronGridAccount,
  TronGridTransaction,
  USDT_CONTRACT
} from "@/lib/tron";

type TronGridResponse<T> = {
  success?: boolean;
  data?: T[];
  meta?: {
    fingerprint?: string;
  };
};

type CoinbaseRatesResponse = {
  data?: {
    rates?: {
      CNY?: string;
    };
  };
};

type FrankfurterResponse = {
  rates?: {
    CNY?: number;
  };
};

type FetchAddressOptions = {
  direction: Direction;
  fingerprint?: string | null;
};

async function tronGridFetch<T>(path: string): Promise<TronGridResponse<T>> {
  const headers = new Headers({ Accept: "application/json" });
  const apiKey = process.env.NEXT_PUBLIC_TRONGRID_API_KEY;
  if (apiKey) headers.set("TRON-PRO-API-KEY", apiKey);

  const response = await fetch(`${TRONGRID_BASE_URL}${path}`, {
    headers,
    signal: AbortSignal.timeout(20_000)
  });

  if (!response.ok) {
    throw new Error(`TRONGRID_${response.status}`);
  }

  return response.json() as Promise<TronGridResponse<T>>;
}

async function fetchUsdtCnyRate(): Promise<number | null> {
  try {
    const response = await fetch(
      "https://api.coinbase.com/v2/exchange-rates?currency=USDT",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8_000)
      }
    );
    if (response.ok) {
      const payload = (await response.json()) as CoinbaseRatesResponse;
      const rate = Number(payload.data?.rates?.CNY);
      if (Number.isFinite(rate) && rate > 0) return rate;
    }
  } catch {
    // Continue to the USD/CNY fallback because USDT is USD-pegged.
  }

  try {
    const response = await fetch(
      "https://api.frankfurter.app/latest?from=USD&to=CNY",
      {
        headers: { Accept: "application/json" },
        signal: AbortSignal.timeout(8_000)
      }
    );
    if (!response.ok) return null;
    const payload = (await response.json()) as FrankfurterResponse;
    const rate = Number(payload.rates?.CNY);
    return Number.isFinite(rate) && rate > 0 ? rate : null;
  } catch {
    return null;
  }
}

export async function fetchAddressData(
  address: string,
  options: FetchAddressOptions
): Promise<AddressResult> {
  const transactionParams = new URLSearchParams({
    only_confirmed: "true",
    limit: "20",
    contract_address: USDT_CONTRACT,
    order_by: "block_timestamp,desc"
  });
  if (options.fingerprint) {
    transactionParams.set("fingerprint", options.fingerprint);
  }

  const [accountResponse, transactionResponse, cnyRate] = await Promise.all([
    tronGridFetch<TronGridAccount>(
      `/v1/accounts/${encodeURIComponent(address)}?only_confirmed=true`
    ),
    tronGridFetch<TronGridTransaction>(
      `/v1/accounts/${encodeURIComponent(address)}/transactions/trc20?${transactionParams}`
    ),
    fetchUsdtCnyRate()
  ]);

  const account = accountResponse.data?.[0];
  return {
    address,
    activatedAt: account?.create_time ?? null,
    updatedAt: account?.latest_opration_time ?? null,
    trxBalance: Number(account?.balance ?? 0) / 1_000_000,
    usdtBalance: parseUsdtBalance(account),
    cnyRate,
    cnyRateUpdatedAt: cnyRate ? Date.now() : null,
    transactions: mapTransactions(
      address,
      transactionResponse.data ?? [],
      options.direction
    ),
    nextFingerprint: transactionResponse.meta?.fingerprint ?? null
  };
}
