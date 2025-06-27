import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { ProUpgradeService } from '../src/services/ProUpgradeService';

describe('ProUpgradeService', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('posts checkout parameters and returns true on success', async () => {
    const fetchMock = vi.fn().mockResolvedValue({ ok: true });
    global.fetch = fetchMock as any;
    const svc = new ProUpgradeService();
    const ok = await svc.checkoutMock();
    expect(ok).toBe(true);
    expect(fetchMock).toHaveBeenCalledWith(
      'http://localhost:12111/v1/checkout/sessions',
      expect.objectContaining({
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      })
    );
    const body = (fetchMock.mock.calls[0][1] as any).body as string;
    expect(body).toContain('mode=payment');
    expect(body).toContain('success_url');
    expect(body).toContain('cancel_url');
  });

  it('returns false on network failure', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('net')) as any;
    const svc = new ProUpgradeService();
    const ok = await svc.checkoutMock();
    expect(ok).toBe(false);
  });

  it('returns false for non-ok response', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false }) as any;
    const svc = new ProUpgradeService();
    const ok = await svc.checkoutMock();
    expect(ok).toBe(false);
  });
});
