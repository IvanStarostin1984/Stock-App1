/* eslint-env browser */
/* global GeolocationPosition */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  LocationService,
  setPositionGetter,
  setIsoCodeGetter
} from '../src/services/LocationService';
import { ApiQuotaLedger } from '../src/utils/ApiQuotaLedger';
import type { CountrySetting } from '../src/repositories/CountrySettingRepository';

class FakeRepo {
  saved?: CountrySetting;
  async save(s: CountrySetting) {
    this.saved = s;
  }
  async load() {
    return null;
  }
}

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
  setPositionGetter(() =>
    new Promise(resolve =>
      resolve({ coords: { latitude: 0, longitude: 0 } } as GeolocationPosition)
    )
  );
  setIsoCodeGetter(async () => null);
});

describe('LocationService parity with Dart', () => {
  it('increments ledger after window expiry', async () => {
    vi.useFakeTimers();
    const repo = new FakeRepo();
    const ledger = new ApiQuotaLedger(1, 50);
    const svc = new LocationService(repo as any, ledger);
    setPositionGetter(
      vi.fn().mockResolvedValue({ coords: { latitude: 1, longitude: 2 } }) as any
    );
    setIsoCodeGetter(vi.fn().mockResolvedValue('US') as any);

    await svc.resolveCountry();
    expect(ledger.isSafe()).toBe(false);
    vi.advanceTimersByTime(60);
    expect(ledger.isSafe()).toBe(true);
    await svc.resolveCountry();
    expect(repo.saved?.iso2).toBe('US');
  });

  it('throws when ledger disallows', async () => {
    const repo = new FakeRepo();
    const ledger = new ApiQuotaLedger(0);
    const svc = new LocationService(repo as any, ledger);
    setPositionGetter(
      vi.fn().mockResolvedValue({ coords: { latitude: 1, longitude: 2 } }) as any
    );
    setIsoCodeGetter(vi.fn().mockResolvedValue('US') as any);
    await expect(svc.resolveCountry()).rejects.toThrow('quota');
  });

  it('throws when iso code missing', async () => {
    const repo = new FakeRepo();
    const ledger = new ApiQuotaLedger(1);
    const svc = new LocationService(repo as any, ledger);
    setPositionGetter(
      vi.fn().mockResolvedValue({ coords: { latitude: 1, longitude: 2 } }) as any
    );
    setIsoCodeGetter(vi.fn().mockResolvedValue(null) as any);
    await expect(svc.resolveCountry()).rejects.toThrow();
  });
});
