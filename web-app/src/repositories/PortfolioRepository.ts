import { get, set } from 'idb-keyval';
import { QuoteRepository } from './QuoteRepository';

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
  }

  /**
   * Refresh total values using cached quotes.
   */
  async refreshTotals(): Promise<number> {
    const list = await this.list();
    let total = 0;
    for (const h of list) {
      const quote = await this.quoteRepo.headline(h.symbol);
      if (quote) total += quote.close * h.quantity;
    }
    return total;
  }
}
