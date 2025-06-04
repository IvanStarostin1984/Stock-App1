import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import { logApiCall } from '@/utils/logMetrics';
import type { Quote } from '../../../packages/generated-ts/models/Quote';

export type { Quote };


const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h

/**
 * Service for retrieving end-of-day stock quotes from Marketstack.
 */
export class MarketstackService {
  private cache = new LruCache<string, Quote>(32);
  private ledger = new ApiQuotaLedger(100);
  private apiKey: string;
  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

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
    const start = performance.now();
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      this.ledger.increment();
      const data = await resp.json();
      const raw = data.data[0];
      const quote: Quote = {
        symbol: raw.symbol,
        price: raw.close,
        open: raw.open,
        high: raw.high,
        low: raw.low,
        close: raw.close
      };
      this.cache.put(symbol, quote, CACHE_TTL);
      return quote;
    } catch {
      return null;
    } finally {
      logApiCall('MarketstackService.getQuote', start);
    }
  }
}
