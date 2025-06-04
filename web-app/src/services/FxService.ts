import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';

const CACHE_TTL = 24 * 60 * 60 * 1000;

export class FxService {
  private cache = new LruCache<string, number>(16);
  private ledger = new ApiQuotaLedger(100);

  async getRate(base: string, quote: string): Promise<number | null> {
    const key = `${base}_${quote}`;
    const cached = this.cache.get(key);
    if (cached !== undefined) return cached;
    if (!this.ledger.isSafe()) return null;
    const url = `https://api.exchangerate.host/latest?base=${base}&symbols=${quote}`;
    const resp = await fetch(url);
    if (!resp.ok) return null;
    this.ledger.increment();
    const data = await resp.json();
    const rate = data.rates[quote];
    this.cache.put(key, rate, CACHE_TTL);
    return rate;
  }
}
