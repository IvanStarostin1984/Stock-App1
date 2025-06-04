/**
 * Minimal in-memory least-recently-used cache with TTL support.
 *
 * Stored entries expire after the provided TTL and the cache
 * evicts the oldest entry when capacity is exceeded.
 */
export class LruCache<K, V> {
  private capacity: number;
  private map: Map<K, V> = new Map();
  private expiry: Map<K, number> = new Map();

  constructor(capacity = 128) {
    this.capacity = capacity;
  }

  /**
   * Retrieve an entry if present and not expired.
   *
   * Refreshes the usage order when a valid item is found.
   *
   * @param key - Cache key.
   * @returns The stored value or `undefined` when absent or expired.
   */
  get(key: K): V | undefined {
    const value = this.map.get(key);
    const exp = this.expiry.get(key);
    if (value !== undefined && exp && exp > Date.now()) {
      this.map.delete(key);
      this.map.set(key, value); // refresh order
      return value;
    }
    if (value !== undefined) {
      this.delete(key);
    }
    return undefined;
  }

  /**
   * Insert or replace a cache entry.
   *
   * Evicts the least recently used item when the capacity is
   * exceeded.
   *
   * @param key - Cache key.
   * @param value - Item to store.
   * @param ttlMs - Time-to-live in milliseconds.
   */
  put(key: K, value: V, ttlMs: number) {
    if (this.map.size >= this.capacity) {
      const first = this.map.keys().next();
      if (!first.done) {
        this.delete(first.value);
      }
    }
    this.map.set(key, value);
    this.expiry.set(key, Date.now() + ttlMs);
  }

  /**
   * Remove an entry from the cache.
   *
   * @param key - Cache key to delete.
   */
  delete(key: K) {
    this.map.delete(key);
    this.expiry.delete(key);
  }
}
