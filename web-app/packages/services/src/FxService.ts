import { LruCache } from '../../../src/utils/LruCache';
import { ApiQuotaLedger } from '../../../src/utils/ApiQuotaLedger';
import { fetchCached } from '../../../../packages/core/src/net';

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
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`;
    return fetchCached(
      this.cache,
      this.ledger,
      key,
      url,
      CACHE_TTL,
      data => data.rates[quote],
      'FxService.getRate'
    );
  }
}
