import { describe, it, expect, vi } from 'vitest';
import { fetchJson } from '../net';
import { LruCache } from '../../../web-app/src/utils/LruCache';
import { ApiQuotaLedger } from '../../../web-app/src/utils/ApiQuotaLedger';

describe('fetchJson (core)', () => {
  it('returns null if quota exceeded', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = { isSafe: vi.fn().mockReturnValue(false), increment: vi.fn() } as unknown as ApiQuotaLedger;
    global.fetch = vi.fn();
    const res = await fetchJson('u', cache, ledger, j => j as number);
    expect(res).toBeNull();
  });
});
