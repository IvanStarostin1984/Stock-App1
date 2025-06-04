/**
 * Tracks API request quotas over a rolling time window.
 *
 * The ledger increments with each request and determines
 * whether another call can be made based on the configured
 * limit.
 */
export class ApiQuotaLedger {
  private rollingCount = 0;
  private windowStart = Date.now();
  private limit: number;
  private windowMs: number;
  constructor(limit: number, windowMs = 24 * 60 * 60 * 1000) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  /**
   * Increase the count for the current window.
   *
   * Resets the window when the configured time span has
   * elapsed. This mutates the internal counters.
   */
  increment() {
    const now = Date.now();
    if (now - this.windowStart >= this.windowMs) {
      this.windowStart = now;
      this.rollingCount = 0;
    }
    this.rollingCount++;
  }

  /**
   * Check if another request can be made without exceeding the
   * quota.
   *
   * @returns `true` when under the limit or the time window has
   *   rolled over.
   */
  isSafe(): boolean {
    const now = Date.now();
    if (now - this.windowStart >= this.windowMs) {
      return true;
    }
    return this.rollingCount < this.limit;
  }
}
