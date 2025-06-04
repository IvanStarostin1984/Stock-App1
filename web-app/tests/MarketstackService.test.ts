import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MarketstackService, type Quote } from '../src/services/MarketstackService';

const sampleApiQuote = {
  symbol: 'AAPL',
  open: 1,
  high: 2,
  low: 0.5,
  close: 1.5
};

const sampleQuote: Quote = {
  symbol: 'AAPL',
  price: 1.5,
  open: 1,
  high: 2,
  low: 0.5,
  close: 1.5
};

describe('MarketstackService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches quote and caches result', async () => {
    const service = new MarketstackService('k');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;

    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ data: [sampleApiQuote] }) });
    global.fetch = fetchMock as any;

    const first = await service.getQuote('AAPL');
    expect(first).toEqual(sampleQuote);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(ledger.increment).toHaveBeenCalledTimes(1);

    const second = await service.getQuote('AAPL');
    expect(second).toEqual(sampleQuote);
    expect(fetchMock).toHaveBeenCalledTimes(1); // from cache
  });

  it('returns null when quota exceeded', async () => {
    const service = new MarketstackService('k');
    const ledger = { isSafe: vi.fn().mockReturnValue(false), increment: vi.fn() };
    (service as any).ledger = ledger;
    const fetchMock = vi.fn();
    global.fetch = fetchMock as any;

    const result = await service.getQuote('IBM');
    expect(result).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('handles failed fetch and does not cache', async () => {
    const service = new MarketstackService('k');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [sampleApiQuote] }) });
    global.fetch = fetchMock as any;

    const fail = await service.getQuote('AAPL');
    expect(fail).toBeNull();
    expect(ledger.increment).not.toHaveBeenCalled();

    const success = await service.getQuote('AAPL');
    expect(success).toEqual(sampleQuote);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).toHaveBeenCalledTimes(1);
  });

  it('stores quotes separately per symbol', async () => {
    const service = new MarketstackService('k');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    const quoteB: Quote = { ...sampleQuote, symbol: 'IBM' };
    const apiQuoteB = { ...sampleApiQuote, symbol: 'IBM' };
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [sampleApiQuote] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ data: [apiQuoteB] }) });
    global.fetch = fetchMock as any;

    const first = await service.getQuote('AAPL');
    expect(first).toEqual(sampleQuote);
    const second = await service.getQuote('IBM');
    expect(second).toEqual(quoteB);
    await service.getQuote('AAPL');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).toHaveBeenCalledTimes(2);
  });
});
