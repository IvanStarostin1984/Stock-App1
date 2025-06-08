import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import { logApiCall } from '@/utils/logMetrics';
import { fetchJson } from '../../../packages/core/net';

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
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`;
    const start = performance.now();
    const rate = await fetchJson<{ rates: Record<string, number> }>(
      url,
      this.cache,
      this.ledger,
      json => json.rates[quote]
    );
    logApiCall('FxService.getRate', start);
    return rate ?? null;
  }
}
