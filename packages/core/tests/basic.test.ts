import { describe, it, expect, vi } from 'vitest';
import { fetchJson } from '../net';
import { LruCache } from '../../../web-app/src/utils/LruCache';
import { ApiQuotaLedger } from '../../../web-app/src/utils/ApiQuotaLedger';

describe('fetchJson (core)', () => {
  it('returns null if quota exceeded', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = { isSafe: vi.fn().mockReturnValue(false), increment: vi.fn() } as unknown as ApiQuotaLedger;
    global.fetch = vi.fn();
    const res = await fetchJson('u', cache, ledger, j => j as number, 50);
    expect(res).toBeNull();
  });

  it('expires cache after ttl', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() } as unknown as ApiQuotaLedger;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => 1 });
    global.fetch = fetchMock as any;

    await fetchJson('u', cache, ledger, j => j as number, 5);
    await new Promise(r => setTimeout(r, 10));
    await fetchJson('u', cache, ledger, j => j as number, 5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
  it('returns null when fetch throws', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() } as unknown as ApiQuotaLedger;
    global.fetch = vi.fn().mockRejectedValue(new Error('fail'));
    const res = await fetchJson('u', cache, ledger, j => j as number, 50);
    expect(res).toBeNull();
  });
});
