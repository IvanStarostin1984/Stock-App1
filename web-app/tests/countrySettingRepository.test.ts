/* eslint-env browser */
import { describe, it, expect, beforeEach } from 'vitest';
import { CountrySettingRepository, type CountrySetting } from '../src/repositories/CountrySettingRepository';

describe('CountrySettingRepository', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('saves and loads setting', async () => {
    const repo = new CountrySettingRepository();
    const setting: CountrySetting = {
      iso2: 'US',
      lastCurrency: 'USD',
      acquired: '2024-01-01T00:00:00Z',
      method: 'GPS'
    };
    await repo.save(setting);
    const loaded = await repo.load();
    expect(loaded).toEqual(setting);
  });

  it('returns null when empty', async () => {
    const repo = new CountrySettingRepository();
    const loaded = await repo.load();
    expect(loaded).toBeNull();
  });
});
