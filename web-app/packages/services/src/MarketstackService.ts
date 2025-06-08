import { LruCache } from '../../../src/utils/LruCache';
import { ApiQuotaLedger } from '../../../src/utils/ApiQuotaLedger';
import { fetchCached } from '../../../../packages/core/src/net';
import type { Quote } from '../../../../packages/generated-ts/models/Quote';

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
    return fetchCached(
      this.cache,
      this.ledger,
      symbol,
      url,
      CACHE_TTL,
      data => {
        const raw = data.data[0];
        return {
          symbol: raw.symbol,
          price: raw.close,
          open: raw.open,
          high: raw.high,
          low: raw.low,
          close: raw.close
        } as Quote;
      },
      'MarketstackService.getQuote'
    );
  }
}
