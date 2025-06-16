export const DAY_MS = 24 * 60 * 60 * 1000;

/** Time-to-live constant for a 12 hour cache. */
export const HALF_DAY_MS = 12 * 60 * 60 * 1000;

/**
 * Fetch JSON from the network with caching and quota control.
 *
 * The provided `cache` stores results for a caller-specified TTL.
 * The `ledger` ensures request quotas are respected. The
 * `transform` callback maps the raw JSON payload into the desired
 * return type. Use `DAY_MS` or `HALF_DAY_MS` for common durations.
 */
export async function fetchJson<T>(
  url: string,
  cache: import('../../web-app/src/utils/LruCache').LruCache<string, T>,
  ledger: import('../../web-app/src/utils/ApiQuotaLedger').ApiQuotaLedger,
  transform: (json: any) => T,
  ttlMs: number = DAY_MS
): Promise<T | null> {
  const cached = cache.get(url);
  if (cached !== undefined) return cached;
  if (!ledger.isSafe()) return null;
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    const json = await resp.json();
    ledger.increment();
    const data = transform(json);
    cache.put(url, data, ttlMs);
    return data;
  } catch {
    return null;
  }
}

/**
 * Simple client wrapper around `fetchJson` for convenience.
 */
export class NetClient {
  constructor(
    private ledger: import('../../web-app/src/utils/ApiQuotaLedger').ApiQuotaLedger
  ) {}

  /**
   * Perform a GET request using an existing cache and the client's ledger.
   * The caller specifies how long the result should remain cached.
   */
  async get<T>(
    url: string,
    cache: import('../../web-app/src/utils/LruCache').LruCache<string, T>,
    transform: (json: any) => T,
    ttlMs: number = DAY_MS
  ): Promise<T | null> {
    return fetchJson(url, cache, this.ledger, transform, ttlMs);
  }
}
