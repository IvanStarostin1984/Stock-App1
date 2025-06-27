/* global URLSearchParams */
import { logApiCall } from '@/utils/logMetrics';

/**
 * S-06 – ProUpgradeService
 *
 * Calls the local stripe-mock checkout endpoint
 * and resolves to `true` when the request succeeds.
 */
export class ProUpgradeService {
  private url = 'http://localhost:12111/v1/checkout/sessions';

  /** Trigger mock checkout via stripe-mock. */
  async checkoutMock(): Promise<boolean> {
    const body = new URLSearchParams({
      mode: 'payment',
      success_url: 'https://example.com/success',
      cancel_url: 'https://example.com/cancel',
      'line_items[0][price]': 'pro_demo'
    }).toString();
    const start = performance.now();
    try {
      const resp = await fetch(this.url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body
      });
      return resp.ok;
    } catch {
      return false;
    } finally {
      logApiCall('ProUpgradeService.checkoutMock', start);
    }
  }
}
