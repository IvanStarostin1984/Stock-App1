import { LruCache } from "@/utils/LruCache";
import { ApiQuotaLedger } from "@/utils/ApiQuotaLedger";

export interface Quote {
  symbol: string;
  date: string;
  open: number;
  high: number;
  low: number;
  close: number;
}

const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

/**
 * Service for retrieving end-of-day stock quotes from Marketstack.
 */
export class MarketstackService {
  private cache = new LruCache<string, Quote>(32);
  private ledger = new ApiQuotaLedger(100);
  constructor(private apiKey: string) {}

  /**
   * Retrieve the latest quote for a given stock symbol.
   *
   * Results are cached and API usage is throttled via the
   * internal quota ledger.
   *
   * @param symbol - Stock ticker symbol.
   * @returns Quote information or `null` when not available.
   */
  async getQuote(symbol: string): Promise<Quote | null> {
    const cached = this.cache.get(symbol);
    if (cached) return cached;
    if (!this.ledger.isSafe()) {
      return null;
    }
    const url = `https://api.marketstack.com/v1/eod/latest?access_key=${this.apiKey}&symbols=${symbol}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    this.ledger.increment();
    const data = await resp.json();
    const quote: Quote = data.data[0];
    this.cache.put(symbol, quote, CACHE_TTL);
    return quote;
  }
}
