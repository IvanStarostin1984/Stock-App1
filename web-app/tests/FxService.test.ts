import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { FxService } from '../src/services/FxService';

describe('FxService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('fetches rate and caches result', async () => {
    const service = new FxService();
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ rates: { USD: 1.2 } }) });
    global.fetch = fetchMock as any;

    const first = await service.getRate('EUR', 'USD');
    expect(first).toBe(1.2);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(ledger.increment).toHaveBeenCalledTimes(1);

    const second = await service.getRate('EUR', 'USD');
    expect(second).toBe(1.2);
    expect(fetchMock).toHaveBeenCalledTimes(1); // cached
  });

  it('returns null when quota exceeded', async () => {
    const service = new FxService();
    const ledger = { isSafe: vi.fn().mockReturnValue(false), increment: vi.fn() };
    (service as any).ledger = ledger;
    global.fetch = vi.fn();

    const res = await service.getRate('EUR', 'USD');
    expect(res).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('handles fetch failure and does not cache', async () => {
    const service = new FxService();
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ rates: { USD: 1.2 } }) });
    global.fetch = fetchMock as any;

    const bad = await service.getRate('EUR', 'USD');
    expect(bad).toBeNull();
    expect(ledger.increment).not.toHaveBeenCalled();

    const good = await service.getRate('EUR', 'USD');
    expect(good).toBe(1.2);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).toHaveBeenCalledTimes(1);
  });
});
