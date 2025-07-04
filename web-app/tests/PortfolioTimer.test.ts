import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAppStore } from '../src/stores/appStore';
import { QuoteRepository } from '../src/repositories/QuoteRepository';

beforeEach(() => {
  setActivePinia(createPinia());
});

afterEach(() => {
  vi.useRealTimers();
});

describe('portfolio timer', () => {
  it('refreshes totals hourly', async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2020-01-01T10:15:30Z'));
    const refreshTotals = vi.fn().mockResolvedValue(2);
    const store = createAppStore({
      portfolioRepo: { refreshTotals, list: vi.fn().mockResolvedValue([]) } as any,
      watchRepo: { list: vi.fn().mockResolvedValue([]), save: vi.fn() } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxRepo: { rate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    const now = new Date();
    const delay =
      (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000;
    expect(refreshTotals).not.toHaveBeenCalled();
    vi.advanceTimersByTime(delay);
    await Promise.resolve();
    expect(refreshTotals).toHaveBeenCalledTimes(1);
    expect(store.portfolioTotal).toBe(2);
    vi.advanceTimersByTime(60 * 60 * 1000);
    await Promise.resolve();
    expect(refreshTotals).toHaveBeenCalledTimes(2);
  });
});
