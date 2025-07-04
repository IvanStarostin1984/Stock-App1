import { describe, it, expect, vi, afterEach } from 'vitest';
import { ProUpgradeService } from '../src/services/ProUpgradeService';
import { ApiQuotaLedger } from '../src/utils/ApiQuotaLedger';

class TestService extends ProUpgradeService {
  constructor(private ledger: ApiQuotaLedger, private update: (v: boolean) => void) {
    super();
  }
  async checkoutMock(): Promise<boolean> {
    if (!this.ledger.isSafe()) return false;
    const ok = await super.checkoutMock();
    if (ok) {
      this.ledger.increment();
      await this.update(true);
    }
    return ok;
  }
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

describe('ProUpgradeService parity with Dart', () => {
  it('ledger increments again after window expiry', async () => {
    vi.useFakeTimers();
    const ledger = new ApiQuotaLedger(1, 50);
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as any;
    const flag = { value: false };
    const svc = new TestService(ledger, v => (flag.value = v));

    const ok1 = await svc.checkoutMock();
    expect(ok1).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(flag.value).toBe(true);
    expect(ledger.isSafe()).toBe(false);

    vi.advanceTimersByTime(60);
    expect(ledger.isSafe()).toBe(true);

    const ok2 = await svc.checkoutMock();
    expect(ok2).toBe(true);
    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(ledger.isSafe()).toBe(false);
  });

  it('returns false when ledger disallows', async () => {
    const ledger = new ApiQuotaLedger(0);
    const fetchMock = vi.fn();
    global.fetch = fetchMock as any;
    const svc = new TestService(ledger, () => {});

    const ok = await svc.checkoutMock();
    expect(ok).toBe(false);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('returns false on network error', async () => {
    const ledger = new ApiQuotaLedger(1);
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as any;
    const svc = new TestService(ledger, () => {});

    const ok = await svc.checkoutMock();
    expect(ok).toBe(false);
  });
});
