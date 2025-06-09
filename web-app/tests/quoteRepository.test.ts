import { describe, it, expect, vi } from 'vitest';
import { QuoteRepository } from '../src/repositories/QuoteRepository';
import type { Quote } from '../src/services/MarketstackService';

const sampleQuote: Quote = {
  symbol: 'AAPL',
  price: 1,
  open: 1,
  high: 1,
  low: 1,
  close: 1
};

const movers = { gainers: [sampleQuote], losers: [sampleQuote] };

describe('QuoteRepository', () => {
  it('caches headline results', async () => {
    const getQuote = vi.fn().mockResolvedValue(sampleQuote);
    const repo = new QuoteRepository({ getQuote } as any);
    const first = await repo.headline('AAPL');
    const second = await repo.headline('AAPL');
    expect(first).toEqual(sampleQuote);
    expect(second).toBe(first);
    expect(getQuote).toHaveBeenCalledTimes(1);
  });

  it('returns null when service fails', async () => {
    const getQuote = vi.fn().mockResolvedValue(null);
    const repo = new QuoteRepository({ getQuote } as any);
    const res = await repo.headline('AAPL');
    expect(res).toBeNull();
  });

  it('caches top movers', async () => {
    const getTopMovers = vi.fn().mockResolvedValue(movers);
    const repo = new QuoteRepository({ getTopMovers } as any);
    const first = await repo.topMovers();
    const second = await repo.topMovers();
    expect(first).toEqual(movers);
    expect(second).toBe(first);
    expect(getTopMovers).toHaveBeenCalledTimes(1);
  });

  it('returns null when movers fail', async () => {
    const getTopMovers = vi.fn().mockResolvedValue(null);
    const repo = new QuoteRepository({ getTopMovers } as any);
    const res = await repo.topMovers();
    expect(res).toBeNull();
  });
});
