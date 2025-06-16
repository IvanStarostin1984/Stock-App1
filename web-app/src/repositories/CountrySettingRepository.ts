/* eslint-env browser */
/**
 * A stored location setting with ISO country code and last used currency.
 */
export interface CountrySetting {
  iso2: string;
  lastCurrency: string;
  acquired: string;
  method: string;
}

/**
 * Repository persisting CountrySetting in browser localStorage.
 */
export class CountrySettingRepository {
  private key = 'country_setting';

  /** Save the setting to localStorage. */
  async save(setting: CountrySetting): Promise<void> {
    localStorage.setItem(this.key, JSON.stringify(setting));
  }

  /** Load the stored setting if present. */
  async load(): Promise<CountrySetting | null> {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as CountrySetting) : null;
  }
}
