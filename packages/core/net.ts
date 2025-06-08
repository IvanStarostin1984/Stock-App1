export const DAY_MS = 24 * 60 * 60 * 1000;

/**
 * Fetch JSON from the network with caching and quota control.
 *
 * The provided `cache` stores results for 24 hours. The `ledger`
 * ensures request quotas are respected. The `transform` callback
 * maps the raw JSON payload into the desired return type.
 */
export async function fetchJson<T>(
  url: string,
  cache: import('../web-app/src/utils/LruCache').LruCache<string, T>,
  ledger: import('../web-app/src/utils/ApiQuotaLedger').ApiQuotaLedger,
  transform: (json: any) => T
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
    cache.put(url, data, DAY_MS);
    return data;
  } catch {
    return null;
  }
}
