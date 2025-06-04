import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';

const CACHE_TTL = 24 * 60 * 60 * 1000;

/**
 * Service for retrieving foreign exchange rates from a public API.
 */
export class FxService {
  private cache = new LruCache<string, number>(16);
  private ledger = new ApiQuotaLedger(100);

  /**
   * Fetch a conversion rate from `base` to `quote`.
   *
   * Results are cached for 24 hours and API usage is limited by
   * the internal quota ledger.
   *
   * @param base - Currency to convert from.
   * @param quote - Currency to convert to.
   * @returns The numeric exchange rate or `null` when unavailable.
   */
  async getRate(base: string, quote: string): Promise<number | null> {
    const key = `${base}_${quote}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;
    if (!this.ledger.isSafe()) return null;
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      this.ledger.increment();
      const data = await resp.json();
      const rate = data.rates[quote];
      this.cache.put(key, rate, CACHE_TTL);
      return rate;
    } catch {
      return null;
    }
  }
}
