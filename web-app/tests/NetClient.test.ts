import { describe, it, expect, vi } from 'vitest';
import { NetClient } from '../../packages/core/net';
import { LruCache } from '../src/utils/LruCache';
import { ApiQuotaLedger } from '../src/utils/ApiQuotaLedger';

function ledger(allowed: boolean) {
  return {
    isSafe: vi.fn().mockReturnValue(allowed),
    increment: vi.fn(),
  } as unknown as ApiQuotaLedger;
}

describe('NetClient', () => {
  it('caches responses via fetchJson', async () => {
    const cache = new LruCache<string, number>(1);
    const led = ledger(true);
    const client = new NetClient(led);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => 5 });
    global.fetch = fetchMock as any;

    const a = await client.get('u', cache, j => j as number, 50);
    const b = await client.get('u', cache, j => j as number, 50);
    expect(a).toBe(5);
    expect(b).toBe(5);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(led.increment).toHaveBeenCalledTimes(1);
  });

  it('returns null when quota exceeded', async () => {
    const cache = new LruCache<string, number>(1);
    const led = ledger(false);
    const client = new NetClient(led);
    global.fetch = vi.fn();
    const res = await client.get('u', cache, j => j as number, 50);
    expect(res).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('respects ttl when caching', async () => {
    const cache = new LruCache<string, number>(1);
    const led = ledger(true);
    const client = new NetClient(led);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => 7 });
    global.fetch = fetchMock as any;

    await client.get('u', cache, j => j as number, 5);
    await new Promise(r => setTimeout(r, 10));
    await client.get('u', cache, j => j as number, 5);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
