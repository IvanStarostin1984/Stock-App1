/* eslint-disable @typescript-eslint/no-unused-vars */
import { describe, it, expect, beforeEach } from 'vitest';
import 'fake-indexeddb/auto';
import { set } from 'idb-keyval';
import { PortfolioRepository, PortfolioHolding } from '../src/repositories/PortfolioRepository';

type FakeQuoteRepo = { calls: number; headline: () => Promise<{ close: number } | null> };

const sample: PortfolioHolding = {
  id: '1',
  symbol: 'AAPL',
  quantity: 2,
  buyPrice: 100,
  added: '2024-01-01T00:00:00Z'
};

function fakeRepo(price: number): FakeQuoteRepo {
  return {
    calls: 0,
    async headline() {
      this.calls++;
      return { close: price } as any;
    }
  };
}

describe('PortfolioRepository parity with Dart', () => {
  beforeEach(async () => {
    await set('holdings', []);
  });

  it('adds and lists holdings', async () => {
    const repo = new PortfolioRepository({ quoteRepo: fakeRepo(1) as any });
    await repo.add(sample);
    const list = await repo.list();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('1');
  });

  it('removes holdings by id', async () => {
    const repo = new PortfolioRepository({ quoteRepo: fakeRepo(1) as any });
    await repo.add(sample);
    await repo.add({ ...sample, id: '2' });
    await repo.remove('1');
    const list = await repo.list();
    expect(list.length).toBe(1);
    expect(list[0].id).toBe('2');
  });

  it('rejects invalid holding', async () => {
    const repo = new PortfolioRepository({ quoteRepo: fakeRepo(1) as any });
    await expect(repo.add({ ...sample, quantity: 0 })).rejects.toThrow();
  });

  it('refreshTotals caches result', async () => {
    const fake = fakeRepo(2);
    const repo = new PortfolioRepository({ quoteRepo: fake as any });
    await repo.add(sample);
    const first = await repo.refreshTotals();
    const second = await repo.refreshTotals();
    expect(first).toBe(second);
    expect(fake.calls).toBe(1);
  });
});
