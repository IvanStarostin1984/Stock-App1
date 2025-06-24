/* eslint-env browser */
/**
 * Repository managing a list of watched stock symbols.
 */
export class WatchListRepository {
  private key = 'watch_list';

  /** Persist the list of symbols to localStorage. */
  async save(list: string[]): Promise<void> {
    if (!Array.isArray(list) || list.some(s => typeof s !== 'string' || !s)) {
      throw new Error('Invalid watch list');
    }
    localStorage.setItem(this.key, JSON.stringify(list));
  }

  /** Load the stored watch list or an empty array. */
  async list(): Promise<string[]> {
    const raw = localStorage.getItem(this.key);
    return raw ? (JSON.parse(raw) as string[]) : [];
  }
}
