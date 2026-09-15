import { describe, expect, it } from "vitest";
import {
  isValidTronAddress,
  mapTransactions,
  normalizeDirection,
  parseUsdtBalance,
  USDT_CONTRACT
} from "./tron";

const address = "TYASr5UV6HEcXatwdFQfmLVUqQQQMUxHLS";

describe("TRON helpers", () => {
  it("validates base58 TRON addresses", () => {
    expect(isValidTronAddress(address)).toBe(true);
    expect(isValidTronAddress("0x1234")).toBe(false);
    expect(isValidTronAddress("")).toBe(false);
  });

  it("normalizes transaction direction", () => {
    expect(normalizeDirection("in")).toBe("in");
    expect(normalizeDirection("out")).toBe("out");
    expect(normalizeDirection("unknown")).toBe("all");
  });

  it("reads USDT balance from a TRC20 map", () => {
    expect(
      parseUsdtBalance({ trc20: [{ [USDT_CONTRACT]: "12500000" }] })
    ).toBe(12.5);
  });

  it("maps and filters transactions", () => {
    const transactions = [
      {
        transaction_id: "abc",
        block_timestamp: 1,
        from: "TFrom1111111111111111111111111111",
        to: address,
        type: "Transfer",
        value: "2500000",
        token_info: {
          symbol: "USDT",
          address: USDT_CONTRACT,
          decimals: 6,
          name: "Tether USD"
        }
      }
    ];

    expect(mapTransactions(address, transactions, "in")).toEqual([
      expect.objectContaining({ amount: 2.5, direction: "in" })
    ]);
    expect(mapTransactions(address, transactions, "out")).toEqual([]);
  });
});
