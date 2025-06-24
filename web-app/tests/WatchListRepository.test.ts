/* eslint-env browser */
import { describe, it, expect, beforeEach } from 'vitest';
import { WatchListRepository } from '../src/repositories/WatchListRepository';

describe('WatchListRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads symbols', async () => {
    const repo = new WatchListRepository();
    await repo.save(['AAPL', 'GOOG']);
    const list = await repo.list();
    expect(list).toEqual(['AAPL', 'GOOG']);
  });

  it('returns empty array when no data', async () => {
    const repo = new WatchListRepository();
    const list = await repo.list();
    expect(list).toEqual([]);
  });

  it('rejects invalid list', async () => {
    const repo = new WatchListRepository();
    // @ts-expect-error
    await expect(repo.save(['AAPL', ''])).rejects.toThrow();
  });
});
