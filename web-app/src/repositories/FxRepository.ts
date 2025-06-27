import { FxService } from '@/services/FxService';
import { LruCache } from '@/utils/LruCache';
import { DAY_MS } from '../../../packages/core/net';

/**
 * Repository providing cached access to FX rates via FxService.
 */
export class FxRepository {
  private svc: FxService;
  private cache = new LruCache<string, number>(32);

  constructor(service?: FxService) {
    this.svc = service ?? new FxService();
  }

  /**
   * Get conversion rate from base to quote using a 24 h cache.
   */
  async rate(base: string, quote: string): Promise<number | null> {
    const key = `${base}_${quote}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;
    const value = await this.svc.getRate(base, quote);
    if (value !== null) this.cache.put(key, value, DAY_MS);
    return value;
  }
}

