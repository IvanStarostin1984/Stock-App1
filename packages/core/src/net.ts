import { LruCache } from '../../../web-app/src/utils/LruCache';
import { ApiQuotaLedger } from '../../../web-app/src/utils/ApiQuotaLedger';

function log(name: string, start: number) {
  if (process.env.NODE_ENV !== 'production') {
    const apiCallMs = Math.round(performance.now() - start);
    console.log(`[api] ${name}`, { apiCallMs });
  }
}

export async function fetchCached<T>(
  cache: LruCache<string, T>,
  ledger: ApiQuotaLedger,
  key: string,
  url: string,
  ttlMs: number,
  transform: (data: any) => T,
  name?: string
): Promise<T | null> {
  const cached = cache.get(key);
  if (cached !== undefined) return cached;
  if (!ledger.isSafe()) return null;
  const start = performance.now();
  try {
    const resp = await fetch(url);
    if (!resp.ok) return null;
    ledger.increment();
    const data = transform(await resp.json());
    cache.put(key, data, ttlMs);
    return data;
  } catch {
    return null;
  } finally {
    log(name ?? url, start);
  }
}
