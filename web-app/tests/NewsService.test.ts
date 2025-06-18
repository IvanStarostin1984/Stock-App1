import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { NewsService, type NewsArticle } from '../src/services/NewsService';
import { NetClient, HALF_DAY_MS } from '../../packages/core/net';

const sampleArticles: NewsArticle[] = [
  { title: 't1', url: 'l1', source: 's1', published: 'p1' },
  { title: 't2', url: 'l2', source: 's2', published: 'p2' },
  { title: 't3', url: 'l3', source: 's3', published: 'p3' }
];

function apiPayload() {
  return {
    results: sampleArticles.map(a => ({
      title: a.title,
      link: a.url,
      source_id: a.source,
      pubDate: a.published
    }))
  };
}

describe('NewsService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws for empty API key', () => {
    expect(() => new NewsService('')).toThrow();
  });

  it('fetches news and caches result', async () => {
    const service = new NewsService('key');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    (service as any).client = new NetClient(ledger);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true, json: async () => apiPayload() });
    global.fetch = fetchMock as any;

    const first = await service.getNews('AA');
    expect(first).toEqual(sampleArticles);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(ledger.increment).toHaveBeenCalledTimes(1);

    const second = await service.getNews('AA');
    expect(second).toEqual(sampleArticles);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('returns null when quota exceeded', async () => {
    const service = new NewsService('key');
    const ledger = { isSafe: vi.fn().mockReturnValue(false), increment: vi.fn() };
    (service as any).ledger = ledger;
    (service as any).client = new NetClient(ledger);
    global.fetch = vi.fn();

    const res = await service.getNews('AA');
    expect(res).toBeNull();
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('uses RSS fallback when API returns error', async () => {
    const service = new NewsService('key');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    (service as any).client = new NetClient(ledger);
    const rss = `<?xml version="1.0"?><rss><channel><item><title>r2</title><link>u2</link><pubDate>d2</pubDate></item></channel></rss>`;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, text: async () => rss });
    global.fetch = fetchMock as any;

    const res = await service.getNews('AA');
    expect(res).toEqual([{ title: 'r2', url: 'u2', source: 'rss', published: 'd2' }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).not.toHaveBeenCalled();
  });

  it('falls back to RSS when API fails', async () => {
    const service = new NewsService('key');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    (service as any).client = new NetClient(ledger);
    const rss = `<?xml version="1.0"?><rss><channel><item><title>r1</title><link>u1</link><pubDate>d1</pubDate></item></channel></rss>`;
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: false })
      .mockResolvedValueOnce({ ok: true, text: async () => rss });
    global.fetch = fetchMock as any;

    const res = await service.getNews('AA');
    expect(res).toEqual([{ title: 'r1', url: 'u1', source: 'rss', published: 'd1' }]);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).not.toHaveBeenCalled();
  });

  it('maintains separate cache entries per symbol', async () => {
    const service = new NewsService('key');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    (service as any).ledger = ledger;
    (service as any).client = new NetClient(ledger);
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => apiPayload() })
      .mockResolvedValueOnce({ ok: true, json: async () => apiPayload() });
    global.fetch = fetchMock as any;

    const first = await service.getNews('AA');
    expect(first).toEqual(sampleArticles);
    const second = await service.getNews('BB');
    expect(second).toEqual(sampleArticles);
    await service.getNews('AA');
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.increment).toHaveBeenCalledTimes(2);
  });

  it('passes 12h ttl to NetClient', async () => {
    const service = new NewsService('key');
    const ledger = { isSafe: vi.fn().mockReturnValue(true), increment: vi.fn() };
    const client = { get: vi.fn().mockResolvedValue(sampleArticles) } as unknown as NetClient;
    (service as any).ledger = ledger;
    (service as any).client = client;

    await service.getNews('AA');
    expect(client.get).toHaveBeenCalledWith(
      expect.stringContaining('AA'),
      (service as any).cache,
      expect.any(Function),
      HALF_DAY_MS
    );
  });
});
