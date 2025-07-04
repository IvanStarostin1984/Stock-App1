import { get, set } from 'idb-keyval';
import { QuoteRepository } from './QuoteRepository';
import { LruCache } from '../utils/LruCache';

export interface PortfolioHolding {
  id: string;
  symbol: string;
  quantity: number;
  buyPrice: number;
  added: string;
}

/**
 * Repository for persisting portfolio holdings in IndexedDB.
 */
export class PortfolioRepository {
  private storeKey = 'holdings';
  private quoteRepo: QuoteRepository;
  private totalCache = new LruCache<string, number>(1);

  constructor(opts?: { quoteRepo?: QuoteRepository }) {
    this.quoteRepo = opts?.quoteRepo ?? new QuoteRepository();
  }

  /**
   * List all saved holdings.
   */
  async list(): Promise<PortfolioHolding[]> {
    const items = await get<PortfolioHolding[]>(this.storeKey);
    return items ?? [];
  }

  /**
   * Add a new holding after validating fields.
   */
  async add(h: PortfolioHolding): Promise<void> {
    if (!h || !h.symbol || h.quantity <= 0 || h.buyPrice <= 0) {
      throw new Error('Invalid holding');
    }
    const list = await this.list();
    await set(this.storeKey, [...list, h]);
    this.totalCache.delete('total');
  }

  /**
   * Remove a holding by id.
   */
  async remove(id: string): Promise<void> {
    const list = await this.list();
    await set(
      this.storeKey,
      list.filter(item => item.id !== id)
    );
    this.totalCache.delete('total');
  }

  /**
   * Refresh total values using cached quotes.
   */
  async refreshTotals(): Promise<number> {
    const cached = this.totalCache.get('total');
    if (cached !== undefined) return cached;
    const list = await this.list();
    let total = 0;
    for (const h of list) {
      const quote = await this.quoteRepo.headline(h.symbol);
      if (quote) total += quote.close * h.quantity;
    }
    this.totalCache.put('total', total, 60 * 60 * 1000);
    return total;
  }
}
