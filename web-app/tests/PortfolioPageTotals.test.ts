import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import PortfolioPage from '../src/pages/PortfolioPage.vue';
import { set } from 'idb-keyval';
import 'fake-indexeddb/auto';

let storeMock: any;
vi.mock('../src/stores/appStore', () => ({
  useAppStore: () => storeMock
}));

const getQuote = vi.fn();
vi.mock('../src/services/MarketstackService', () => ({
  MarketstackService: vi.fn().mockImplementation(() => ({
    getQuote
  }))
}));

beforeEach(async () => {
  setActivePinia(createPinia());
  storeMock = { syncWatchList: vi.fn() };
  getQuote.mockReset();
  await set('holdings', [
    { id: '1', symbol: 'AAPL', quantity: 2, buyPrice: 1, added: '2024-01-01T00:00:00Z' },
    { id: '2', symbol: 'AAPL', quantity: 3, buyPrice: 1, added: '2024-01-01T00:00:00Z' }
  ]);
});

describe('PortfolioPage totals', () => {
  it('shows total using cached quote', async () => {
    getQuote.mockResolvedValue({ symbol: 'AAPL', price: 2, open: 2, high: 2, low: 2, close: 2 });
    const wrapper = mount(PortfolioPage);
    await new Promise(r => setTimeout(r, 0));
    await new Promise(r => setTimeout(r, 0));
    expect(wrapper.text()).toContain('Total Value: 10');
    expect(getQuote).toHaveBeenCalledTimes(1);
  });
});
