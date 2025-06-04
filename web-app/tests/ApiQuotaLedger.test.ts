import { describe, it, expect, vi } from 'vitest';
import { ApiQuotaLedger } from '../src/utils/ApiQuotaLedger';

describe('ApiQuotaLedger', () => {
  it('allows requests under the limit', () => {
    const ledger = new ApiQuotaLedger(2, 1000);
    expect(ledger.isSafe()).toBe(true);
    ledger.increment();
    expect(ledger.isSafe()).toBe(true);
  });

  it('blocks after limit until window resets', () => {
    vi.useFakeTimers();
    const ledger = new ApiQuotaLedger(1, 50);
    ledger.increment();
    expect(ledger.isSafe()).toBe(false);
    vi.advanceTimersByTime(60);
    expect(ledger.isSafe()).toBe(true);
    vi.useRealTimers();
  });
});
