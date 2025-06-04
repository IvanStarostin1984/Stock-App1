export class LruCache<K, V> {
  private capacity: number;
  private map: Map<K, V> = new Map();
  private expiry: Map<K, number> = new Map();

  constructor(capacity = 128) {
    this.capacity = capacity;
  }

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

  put(key: K, value: V, ttlMs: number) {
    if (this.map.size >= this.capacity) {
      const oldest = this.map.keys().next().value;
      if (oldest !== undefined) {
        this.delete(oldest);
      }
    }
    this.map.set(key, value);
    this.expiry.set(key, Date.now() + ttlMs);
  }

  delete(key: K) {
    this.map.delete(key);
    this.expiry.delete(key);
  }
}
