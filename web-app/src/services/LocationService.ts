/* eslint-env browser */
/* global GeolocationPosition navigator */
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import {
  CountrySettingRepository,
  type CountrySetting
} from '@/repositories/CountrySettingRepository';

/** Function returning the current position. Replaced in tests. */
export let positionGetter = () =>
  new Promise<GeolocationPosition>((resolve, reject) =>
    navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 })
  );
export const setPositionGetter = (fn: typeof positionGetter) => {
  positionGetter = fn;
};

/** Function mapping coordinates to an ISO code. Replaced in tests. */
export let isoCodeGetter = async (
  lat: number,
  lon: number
): Promise<string | null> => {
  const resp = await fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`
  );
  if (!resp.ok) return null;
  const json = await resp.json();
  return json.countryCode ?? null;
};
export const setIsoCodeGetter = (fn: typeof isoCodeGetter) => {
  isoCodeGetter = fn;
};

/**
 * Service resolving the user's country via browser geolocation.
 */
export class LocationService {
  private ledger: ApiQuotaLedger;
  private repo: CountrySettingRepository;

  constructor(
    repo: CountrySettingRepository = new CountrySettingRepository(),
    ledger: ApiQuotaLedger = new ApiQuotaLedger(1)
  ) {
    this.repo = repo;
    this.ledger = ledger;
  }

  /**
   * Resolve the current country and persist it via the repository.
   */
  async resolveCountry(): Promise<CountrySetting> {
    if (!this.ledger.isSafe()) throw new Error('quota exceeded');
    const pos = await positionGetter();
    const iso2 = await isoCodeGetter(pos.coords.latitude, pos.coords.longitude);
    if (!iso2) throw new Error('country not found');
    const setting: CountrySetting = {
      iso2,
      lastCurrency: 'USD',
      acquired: new Date().toISOString(),
      method: 'GPS'
    };
    await this.repo.save(setting);
    this.ledger.increment();
    return setting;
  }
}


