/* eslint-env browser */
/* global GeolocationPosition */
import { describe, it, expect, vi, afterEach } from 'vitest';
import {
  LocationService,
  setPositionGetter,
  setIsoCodeGetter
} from '../src/services/LocationService';
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
  vi.restoreAllMocks();
  setPositionGetter(() =>
    new Promise(resolve =>
      resolve({ coords: { latitude: 0, longitude: 0 } } as GeolocationPosition)
    )
  );
  setIsoCodeGetter(async () => null);
});

describe('LocationService', () => {
  it('resolves and stores country', async () => {
    const repo = new FakeRepo();
    const svc = new LocationService(repo as any);
    setPositionGetter(
      vi.fn().mockResolvedValue({ coords: { latitude: 1, longitude: 2 } }) as any
    );
    setIsoCodeGetter(vi.fn().mockResolvedValue('US') as any);
    const setting = await svc.resolveCountry();
    expect(setting.iso2).toBe('US');
    expect(repo.saved?.iso2).toBe('US');
  });

  it('throws when iso code missing', async () => {
    const svc = new LocationService(new FakeRepo() as any);
    setPositionGetter(
      vi.fn().mockResolvedValue({ coords: { latitude: 1, longitude: 2 } }) as any
    );
    setIsoCodeGetter(vi.fn().mockResolvedValue(null) as any);
    await expect(svc.resolveCountry()).rejects.toThrow();
  });

  it('respects quota ledger', async () => {
    const svc = new LocationService(new FakeRepo() as any);
    (svc as any).ledger = { isSafe: vi.fn().mockReturnValue(false) };
    await expect(svc.resolveCountry()).rejects.toThrow('quota');
  });
});

