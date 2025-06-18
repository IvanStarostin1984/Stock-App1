import { describe, it, expect, vi } from 'vitest';
import { NetClient } from '../net';
import { LruCache } from '../../../web-app/src/utils/LruCache';
import { ApiQuotaLedger } from '../../../web-app/src/utils/ApiQuotaLedger';

describe('NetClient.get', () => {
  it('delegates to fetchJson and caches results', async () => {
    const cache = new LruCache<string, number>(1);
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() } as unknown as ApiQuotaLedger;
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => 9 });
    global.fetch = fetchMock as any;
    const client = new NetClient(ledger);

    const a = await client.get('u', cache, j => j as number, 50);
    const b = await client.get('u', cache, j => j as number, 50);

    expect(a).toBe(9);
    expect(b).toBe(9);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(ledger.increment).toHaveBeenCalledTimes(1);
  });
});
