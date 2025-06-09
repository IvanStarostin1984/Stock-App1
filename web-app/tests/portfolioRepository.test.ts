import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { set } from 'idb-keyval';
import { PortfolioRepository, PortfolioHolding } from '../src/repositories/PortfolioRepository';

const sample: PortfolioHolding = {
  id: '1',
  symbol: 'AAPL',
  quantity: 2,
  buyPrice: 100,
  added: '2024-01-01T00:00:00Z'
};

describe('PortfolioRepository', () => {
  beforeEach(async () => {
    await set('holdings', []);
  });

  it('adds and lists holdings', async () => {
    const repo = new PortfolioRepository({ quoteRepo: { headline: async () => ({ close: 1 } as any) } as any });
    await repo.add(sample);
    const list = await repo.list();
    expect(list.length).toBe(1);
    expect(list[0]).toEqual(sample);
  });

  it('removes holdings by id', async () => {
    const repo = new PortfolioRepository({ quoteRepo: { headline: async () => ({ close: 1 } as any) } as any });
    await repo.add(sample);
    await repo.add({ ...sample, id: '2' });
    await repo.remove('1');
    const list = await repo.list();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('2');
  });

  it('rejects invalid holding', async () => {
    const repo = new PortfolioRepository({ quoteRepo: { headline: async () => ({ close: 1 } as any) } as any });
    await expect(repo.add({ ...sample, quantity: 0 })).rejects.toThrow();
  });
});
