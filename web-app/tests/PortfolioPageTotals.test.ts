import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import PortfolioPage from '../src/pages/PortfolioPage.vue';
import { nextTick, reactive } from 'vue';

let storeMock: any;
vi.mock('../src/stores/appStore', () => ({
  useAppStore: () => storeMock
}));

beforeEach(() => {
  setActivePinia(createPinia());
  storeMock = reactive({
    holdings: [],
    portfolioTotal: 0,
    syncWatchList: vi.fn(),
    loadPortfolio: vi.fn().mockImplementation(function () {
      this.holdings = [
        { id: '1', symbol: 'AAPL', quantity: 2, buyPrice: 1, added: '2024-01-01T00:00:00Z' }
      ];
      this.portfolioTotal = 2;
    }),
    addHolding: vi.fn().mockImplementation(function (h) {
      this.holdings.push(h);
      this.portfolioTotal += h.quantity;
    }),
    removeHolding: vi.fn().mockImplementation(function (id) {
      this.holdings = this.holdings.filter((h: any) => h.id !== id);
      this.portfolioTotal = this.holdings.reduce((t: number, h: any) => t + h.quantity, 0);
    })
  });
});

describe('PortfolioPage totals', () => {
  it('renders list and updates totals', async () => {
    const wrapper = mount(PortfolioPage);
    await new Promise(r => setTimeout(r, 0));
    expect(storeMock.loadPortfolio).toHaveBeenCalled();
    expect(wrapper.text()).toContain('AAPL');
    expect(wrapper.text()).toContain('Total Value: 2');

    await wrapper.vm.addHolding({ id: '2', symbol: 'GOOG', quantity: 1, buyPrice: 1, added: '' });
    await nextTick();
    expect(storeMock.addHolding).toHaveBeenCalled();
    expect(wrapper.text()).toContain('GOOG');
    expect(wrapper.text()).toContain('Total Value: 3');

    await wrapper.vm.removeHolding('1');
    await nextTick();
    expect(storeMock.removeHolding).toHaveBeenCalledWith('1');
    expect(wrapper.text()).not.toContain('AAPL');
    expect(wrapper.text()).toContain('Total Value: 1');
  });
});
