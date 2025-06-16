import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { createAppStore } from '../src/stores/appStore';
import { QuoteRepository } from '../src/repositories/QuoteRepository';
import type { Quote } from '../src/services/MarketstackService';
import type { NewsArticle } from '../src/services/NewsService';

beforeEach(() => {
  setActivePinia(createPinia());
});

describe('appStore', () => {
  it('loads headline and news', async () => {
    const quote: Quote = { symbol: 'AAPL', price: 1, open: 1, high: 1, low: 1, close: 1 };
    const article: NewsArticle = { title: 't', url: 'u', source: 's', published: 'p' } as any;
    const getQuote = vi.fn().mockResolvedValue(quote);
    const getNews = vi.fn().mockResolvedValue([article]);
    const repo = new QuoteRepository({ getQuote } as any);
    const store = createAppStore({
      quoteRepo: repo,
      newsService: { getNews } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();

    await store.loadHeadline('AAPL');
    expect(store.headline).toEqual(quote);
    expect(store.articles).toEqual([article]);
    expect(getQuote).toHaveBeenCalled();
    expect(getNews).toHaveBeenCalled();
  });

  it('toggles currency only with valid rate', async () => {
    const getRate = vi.fn().mockResolvedValue(0.9);
    const store = createAppStore({
      fxService: { getRate } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.toggleCurrency();
    expect(store.currency).toBe('EUR');
    expect(getRate).toHaveBeenCalled();
  });

  it('does not toggle when rate null', async () => {
    const getRate = vi.fn().mockResolvedValue(null);
    const store = createAppStore({
      fxService: { getRate } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    await store.toggleCurrency();
    expect(store.currency).toBe('USD');
  });

  it('search delegates to trie', () => {
    const search = vi.fn().mockReturnValue(['AAPL']);
    const store = createAppStore({
      trie: { search } as any,
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any
    })();
    const results = store.search('AA');
    expect(results).toEqual(['AAPL']);
    expect(store.searchResults).toEqual(['AAPL']);
    expect(search).toHaveBeenCalledWith('AA', 5);
  });

  it('signIn and upgradePro set pro flag', () => {
    const store = createAppStore({
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any
    })();
    store.signIn();
    expect(store.isPro).toBe(true);
    store.isPro = false;
    store.upgradePro();
    expect(store.isPro).toBe(true);
  });

  it('loads top movers', async () => {
    const gainers: Quote[] = [
      { symbol: 'A', price: 1, open: 1, high: 1, low: 1, close: 1 },
    ];
    const losers: Quote[] = [
      { symbol: 'B', price: 2, open: 2, high: 2, low: 2, close: 2 },
    ];
    const getTopMovers = vi.fn().mockResolvedValue({ gainers, losers });
    const store = createAppStore({
      quoteRepo: new QuoteRepository({ getTopMovers } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any,
    })();
    await store.loadTopMovers();
    expect(store.topGainers).toEqual(gainers);
    expect(store.topLosers).toEqual(losers);
    expect(getTopMovers).toHaveBeenCalled();
  });

  it('handles null movers result', async () => {
    const getTopMovers = vi.fn().mockResolvedValue(null);
    const store = createAppStore({
      quoteRepo: new QuoteRepository({ getTopMovers } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any,
    })();
    await store.loadTopMovers();
    expect(store.topGainers).toEqual([]);
    expect(store.topLosers).toEqual([]);
  });

  it('initialises location from repo', async () => {
    const load = vi.fn().mockResolvedValue({
      iso2: 'US',
      lastCurrency: 'USD',
      acquired: '',
      method: 'GPS'
    });
    const store = createAppStore({
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any,
      countryRepo: { load } as any,
      locationService: { resolveCountry: vi.fn() } as any
    })();
    await store.initLocation();
    expect(store.countryCode).toBe('US');
    expect(load).toHaveBeenCalled();
  });

  it('initialises via service when repo empty', async () => {
    const repo = { load: vi.fn().mockResolvedValue(null) } as any;
    const resolveCountry = vi.fn().mockResolvedValue({
      iso2: 'GB',
      lastCurrency: 'GBP',
      acquired: '',
      method: 'GPS'
    });
    const store = createAppStore({
      quoteRepo: new QuoteRepository({ getQuote: vi.fn() } as any),
      newsService: { getNews: vi.fn() } as any,
      fxService: { getRate: vi.fn() } as any,
      trie: { search: vi.fn().mockReturnValue([]) } as any,
      countryRepo: repo,
      locationService: { resolveCountry } as any
    })();
    await store.initLocation();
    expect(store.countryCode).toBe('GB');
    expect(resolveCountry).toHaveBeenCalled();
  });
});
