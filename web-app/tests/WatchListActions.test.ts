import { describe, it, expect, beforeEach, vi } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAppStore } from '../src/stores/appStore';
import { QuoteRepository } from '../src/repositories/QuoteRepository';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('watch list actions', () => {
  it('adds symbol when not present', async () => {
    const list = vi.fn().mockResolvedValue(['AAPL']);
    const save = vi.fn();
    const store = createAppStore({
      watchRepo: { list, save } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.addToWatchList('GOOG');
    expect(save).toHaveBeenCalledWith(['AAPL', 'GOOG']);
  });

  it('does not duplicate symbol', async () => {
    const list = vi.fn().mockResolvedValue(['AAPL']);
    const save = vi.fn();
    const store = createAppStore({
      watchRepo: { list, save } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.addToWatchList('AAPL');
    expect(save).not.toHaveBeenCalled();
  });

  it('removes symbol when present', async () => {
    const list = vi.fn().mockResolvedValue(['AAPL', 'GOOG']);
    const save = vi.fn();
    const store = createAppStore({
      watchRepo: { list, save } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.removeFromWatchList('GOOG');
    expect(save).toHaveBeenCalledWith(['AAPL']);
  });
});
