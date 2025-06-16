import { describe, it, expect, vi } from 'vitest';
import { NetClient } from '../../packages/core/net';
import { LruCache } from '../src/utils/LruCache';
import { ApiQuotaLedger } from '../src/utils/ApiQuotaLedger';

function ledger(limit: number) {
  const led = new ApiQuotaLedger(limit, 50);
  vi.spyOn(led, 'increment');
  return led;
}

describe('NetClient parity with Dart', () => {
  it('increments ledger only when fetching after cache expiry', async () => {
    const led = ledger(2);
    const cache = new LruCache<string, number>(1);
    const client = new NetClient(led);
    const fetchMock = vi
      .fn()
      .mockResolvedValue({ ok: true, json: async () => 1 });
    global.fetch = fetchMock as any;

    await client.get('a', cache, j => j as number, 5);
    await new Promise(r => setTimeout(r, 10));
    await client.get('a', cache, j => j as number, 5);

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(led.increment).toHaveBeenCalledTimes(2);
  });

  it('skips request and increment when ledger disallows', async () => {
    const led = ledger(0);
    const cache = new LruCache<string, number>(1);
    const client = new NetClient(led);
    const fetchMock = vi.fn();
    global.fetch = fetchMock as any;

    const res = await client.get('b', cache, j => j as number, 5);
    expect(res).toBeNull();
    expect(fetchMock).not.toHaveBeenCalled();
    expect(led.increment).not.toHaveBeenCalled();
  });
});
