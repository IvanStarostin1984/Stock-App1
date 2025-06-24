import { describe, it, expect, vi } from 'vitest';
import { NewsService } from '../src/services/NewsService';
import { NetClient, HALF_DAY_MS } from '../../packages/core/net';

function setupService() {
  const svc = new NewsService('k');
  const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
  (svc as any).ledger = ledger;
  return { svc, ledger };
}

describe('NewsService parity with Dart', () => {
  it('increments ledger on successful request', async () => {
    const { svc, ledger } = setupService();
    const client = {
      get: vi.fn().mockImplementation(async () => {
        ledger.increment();
        return [{ title: 't', url: 'l', source: 's', published: 'p' }];
      })
    } as unknown as NetClient;
    (svc as any).client = client;

    const news = await svc.getNews('aa');
    expect(news?.[0].title).toBe('t');
    expect(client.get).toHaveBeenCalled();
    expect(ledger.increment).toHaveBeenCalledTimes(1);
  });

  it('passes HALF_DAY_MS ttl to NetClient', async () => {
    const { svc } = setupService();
    const client = { get: vi.fn().mockResolvedValue([]) } as unknown as NetClient;
    (svc as any).client = client;
    await svc.getNews('bb');
    expect(client.get).toHaveBeenCalledWith(
      expect.stringContaining('bb'),
      (svc as any).cache,
      expect.any(Function),
      HALF_DAY_MS
    );
  });

  it('falls back to RSS when API fails', async () => {
    const { svc, ledger } = setupService();
    const rss = '<?xml version="1.0"?><rss><channel><item><title>r</title><link>u</link><pubDate>d</pubDate></item></channel></rss>';
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, text: async () => rss });
    global.fetch = fetchMock as any;

    const news = await svc.getNews('cc');
    expect(news).toEqual([{ title: 'r', url: 'u', source: 'rss', published: 'd' }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).not.toHaveBeenCalled();
  });
});
