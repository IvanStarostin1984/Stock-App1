/**
 * Utilities for debug performance logging.
 */
export function isDev(): boolean {
  if (typeof process !== 'undefined' && process.env.NODE_ENV !== undefined) {
    return process.env.NODE_ENV !== 'production';
  }
  try {
    return Boolean((import.meta as any).env?.DEV);
  } catch {
    return false;
  }
}

/**
 * Log page or component load time when in development.
 *
 * @param name - Identifier for the load source.
 * @param start - Timestamp recorded before load began.
 */
export function logLoadTime(name: string, start: number): void {
  if (!isDev()) return;
  const loadTimeMs = Math.round(performance.now() - start);
  console.log(`[load] ${name}`, { loadTimeMs });
}

/**
 * Log API call duration when in development.
 *
 * @param name - Identifier for the API call.
 * @param start - Timestamp before the request was sent.
 */
export function logApiCall(name: string, start: number): void {
  if (!isDev()) return;
  const apiCallMs = Math.round(performance.now() - start);
  console.log(`[api] ${name}`, { apiCallMs });
}
