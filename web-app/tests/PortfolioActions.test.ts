import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAppStore } from '../src/stores/appStore';
import { QuoteRepository } from '../src/repositories/QuoteRepository';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('portfolio actions', () => {
  it('loads holdings and totals', async () => {
    const sample = { id: '1', symbol: 'AAPL', quantity: 1, buyPrice: 1, added: '2024-01-01T00:00:00Z' };
    const list = vi.fn().mockResolvedValue([sample]);
    const refreshTotals = vi.fn().mockResolvedValue(2);
    const store = createAppStore({
      portfolioRepo: { list, refreshTotals } as any,
      watchRepo: { list: vi.fn().mockResolvedValue([]), save: vi.fn() } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxRepo: { rate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.loadPortfolio();
    expect(store.holdings).toEqual([sample]);
    expect(store.portfolioTotal).toBe(2);
    expect(list).toHaveBeenCalled();
    expect(refreshTotals).toHaveBeenCalled();
  });

  it('adds holding and refreshes state', async () => {
    const sample = { id: '1', symbol: 'AAPL', quantity: 1, buyPrice: 1, added: '2024-01-01T00:00:00Z' };
    const add = vi.fn();
    const list = vi.fn().mockResolvedValue([sample]);
    const refreshTotals = vi.fn().mockResolvedValue(2);
    const store = createAppStore({
      portfolioRepo: { add, list, refreshTotals } as any,
      watchRepo: { list: vi.fn().mockResolvedValue([]), save: vi.fn() } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxRepo: { rate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.addHolding(sample);
    expect(add).toHaveBeenCalledWith(sample);
    expect(store.holdings).toEqual([sample]);
    expect(store.portfolioTotal).toBe(2);
  });

  it('removes holding and refreshes state', async () => {
    const list = vi.fn().mockResolvedValue([]);
    const refreshTotals = vi.fn().mockResolvedValue(0);
    const remove = vi.fn();
    const store = createAppStore({
      portfolioRepo: { remove, list, refreshTotals } as any,
      watchRepo: { list: vi.fn().mockResolvedValue([]), save: vi.fn() } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxRepo: { rate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.removeHolding('1');
    expect(remove).toHaveBeenCalledWith('1');
    expect(store.holdings).toEqual([]);
    expect(store.portfolioTotal).toBe(0);
  });
});
