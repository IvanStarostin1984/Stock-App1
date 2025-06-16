import { describe, it, expect, vi } from 'vitest';
import { fetchJson } from '../../packages/core/net';
import { LruCache } from '../src/utils/LruCache';
import { ApiQuotaLedger } from '../src/utils/ApiQuotaLedger';

function numLedger(allowed: boolean) {
  return {
    isSafe: vi.fn().mockReturnValue(allowed),
    increment: vi.fn(),
  } as unknown as ApiQuotaLedger;
}

describe('fetchJson', () => {
  it('caches successful responses', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = numLedger(true);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => 3 });
    global.fetch = fetchMock as any;

    const first = await fetchJson<number>('u', cache, ledger, j => j as number, 50);
    const second = await fetchJson<number>('u', cache, ledger, j => j as number, 50);
    expect(first).toBe(3);
    expect(second).toBe(3);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(ledger.increment).toHaveBeenCalledTimes(1);
  });

  it('respects quota ledger', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = numLedger(false);
    global.fetch = vi.fn();
    const res = await fetchJson<number>('u', cache, ledger, j => j as number, 50);
    expect(res).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('does not cache failed requests', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = numLedger(true);
    const fetchMock = vi.fn().mockResolvedValue({ ok: false });
    global.fetch = fetchMock as any;

    const res = await fetchJson<number>('u', cache, ledger, j => j as number, 50);
    expect(res).toBeNull();
    expect(ledger.increment).not.toHaveBeenCalled();

    // second call triggers another fetch since nothing cached
    await fetchJson<number>('u', cache, ledger, j => j as number, 50);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('expires cache entries based on ttl', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = numLedger(true);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => 9 });
    global.fetch = fetchMock as any;

    await fetchJson<number>('u', cache, ledger, j => j as number, 5);
    await new Promise(r => setTimeout(r, 10));
    await fetchJson<number>('u', cache, ledger, j => j as number, 5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
