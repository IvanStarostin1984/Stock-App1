import { MarketstackService, type Quote } from '@/services/MarketstackService';
import { LruCache } from '@/utils/LruCache';
import { DAY_MS } from '../../../packages/core/net';

/**
 * Repository providing cached access to quotes via MarketstackService.
 */
export class QuoteRepository {
  private svc: MarketstackService;
  private headlineCache = new LruCache<string, Quote>(32);
  private moversCache = new LruCache<string, { gainers: Quote[]; losers: Quote[] }>(1);

  constructor(service?: MarketstackService) {
    this.svc =
      service ??
      new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY ?? '');
  }

  /**
   * Returns the latest quote for `symbol` using a 24 h cache.
   */
  async headline(symbol: string = 'AAPL'): Promise<Quote | null> {
    const cached = this.headlineCache.get(symbol);
    if (cached) return cached;
    const quote = await this.svc.getQuote(symbol);
    if (quote) this.headlineCache.put(symbol, quote, DAY_MS);
    return quote;
  }

  /**
   * Returns the top market gainers and losers using a 24 h cache.
   */
  async topMovers(): Promise<{ gainers: Quote[]; losers: Quote[] } | null> {
    const cached = this.moversCache.get('movers');
    if (cached) return cached;
    const data = await this.svc.getTopMovers();
    if (data) this.moversCache.put('movers', data, DAY_MS);
    return data;
  }
}
