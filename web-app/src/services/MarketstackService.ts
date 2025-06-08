import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import { logApiCall } from '@/utils/logMetrics';
import { fetchJson } from '../../../packages/core/net';
import type { Quote } from '../../../packages/generated-ts/models/Quote';

export type { Quote };



/**
 * Service for retrieving end-of-day stock quotes from Marketstack.
 */
export class MarketstackService {
  private cache = new LruCache<string, Quote>(32);
  private moversCache = new LruCache<string, Quote[]>(4);
  private ledger = new ApiQuotaLedger(100);
  private apiKey: string;
  constructor(apiKey: string) {
    if (typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('Marketstack API key is required');
    }
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
    const url = `https://api.marketstack.com/v1/eod/latest?access_key=${this.apiKey}&symbols=${symbol}`;
    const start = performance.now();
    const quote = await fetchJson<{ data: any[] }>(
      url,
      this.cache,
      this.ledger,
      json => {
        const raw = json.data[0];
        return {
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close,
        } as Quote;
      }
    );
    logApiCall('MarketstackService.getQuote', start);
    return quote ?? null;
  }

  /**
   * Retrieve top market gainers and losers.
   *
   * Results are cached separately for gainers and losers and
   * share the same quota ledger as other requests.
   *
   * @returns Lists of top gainers and losers or `null` on failure.
   */
  async getTopMovers(): Promise<{ gainers: Quote[]; losers: Quote[] } | null> {
    const base = 'https://api.marketstack.com/v1/eod/latest';
    const gainUrl = `${base}?access_key=${this.apiKey}&limit=5&sort=change_over_time.desc`;
    const loseUrl = `${base}?access_key=${this.apiKey}&limit=5&sort=change_over_time.asc`;
    const start = performance.now();
    const gainers = await fetchJson<{ data: any[] }>(
      gainUrl,
      this.moversCache,
      this.ledger,
      json =>
        json.data.map(raw => ({
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close,
        })) as Quote[]
    );
    const losers = await fetchJson<{ data: any[] }>(
      loseUrl,
      this.moversCache,
      this.ledger,
      json =>
        json.data.map(raw => ({
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close,
        })) as Quote[]
    );
    logApiCall('MarketstackService.getTopMovers', start);
    if (!gainers || !losers) return null;
    return { gainers, losers };
  }
}
