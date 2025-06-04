export class ApiQuotaLedger {
  private rollingCount = 0;
  private windowStart = Date.now();
  constructor(private limit: number, private windowMs = 24 * 60 * 60 * 1000) {}

  increment() {
    const now = Date.now();
    if (now - this.windowStart >= this.windowMs) {
      this.windowStart = now;
      this.rollingCount = 0;
    }
    this.rollingCount++;
  }

  isSafe(): boolean {
    const now = Date.now();
    if (now - this.windowStart >= this.windowMs) {
      return true;
    }
    return this.rollingCount < this.limit;
  }
}
