import { describe, it, expect, vi } from 'vitest';
import { logLoadTime, logApiCall } from '../src/utils/logMetrics';

describe('logMetrics', () => {
  it('logs when not production', () => {
    vi.stubEnv('NODE_ENV', 'development');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logLoadTime('p', performance.now());
    logApiCall('a', performance.now());
    expect(spy).toHaveBeenCalledTimes(2);
    vi.unstubAllEnvs();
    spy.mockRestore();
  });

  it('skips logging in production', () => {
    vi.stubEnv('NODE_ENV', 'production');
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    logLoadTime('p', performance.now());
    logApiCall('a', performance.now());
    expect(spy).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
    spy.mockRestore();
  });
});
