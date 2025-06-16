import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import { logApiCall } from '@/utils/logMetrics';
import { NetClient, DAY_MS } from '../../../packages/core/net';

/**
 * Service for retrieving foreign exchange rates from a public API.
 */
export class FxService {
  private cache = new LruCache<string, number>(16);
  private ledger = new ApiQuotaLedger(100);
  private client = new NetClient(this.ledger);

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
    const rate = await this.client.get<number>(
      url,
      this.cache,
      json => (json as { rates: Record<string, number> }).rates[quote],
      DAY_MS
    );
    logApiCall('FxService.getRate', start);
    return rate ?? null;
  }
}
