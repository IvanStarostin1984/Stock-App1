import { describe, it, expect } from 'vitest';
import { LruCache } from '../src/utils/LruCache';

describe('LruCache', () => {
  it('stores and retrieves within TTL', () => {
    const cache = new LruCache<string, number>(2);
    cache.put('a', 1, 1000);
    expect(cache.get('a')).toBe(1);
  });

  it('expires after TTL', async () => {
    const cache = new LruCache<string, number>(1);
    cache.put('a', 1, 1);
    expect(cache.get('a')).toBe(1);
    await new Promise(r => setTimeout(r, 5));
    expect(cache.get('a')).toBeUndefined();
  });
});
