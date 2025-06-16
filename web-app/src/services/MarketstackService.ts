import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import { logApiCall } from '@/utils/logMetrics';
import { NetClient, DAY_MS } from '../../../packages/core/net';
import type { Quote } from '../../../packages/generated-ts/models/Quote';

export type { Quote };



/**
 * Service for retrieving end-of-day stock quotes from Marketstack.
 */
export class MarketstackService {
  private cache = new LruCache<string, Quote>(32);
  private moversCache = new LruCache<string, Quote[]>(4);
  private ledger = new ApiQuotaLedger(100);
  private client = new NetClient(this.ledger);
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
    const quote = await this.client.get<Quote>(
      url,
      this.cache,
      json => {
        const raw: any = json.data[0];
        return {
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close,
        } as Quote;
      },
      DAY_MS
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
    const gainers = await this.client.get<Quote[]>(
      gainUrl,
      this.moversCache,
      json =>
        json.data.map((raw: any) => ({
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close,
        })) as Quote[],
      DAY_MS
    );
    const losers = await this.client.get<Quote[]>(
      loseUrl,
      this.moversCache,
      json =>
        json.data.map((raw: any) => ({
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close,
        })) as Quote[],
      DAY_MS
    );
    logApiCall('MarketstackService.getTopMovers', start);
    if (!gainers || !losers) return null;
    return { gainers, losers };
  }
}
