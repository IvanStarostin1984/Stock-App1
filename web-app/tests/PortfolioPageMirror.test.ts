import { mount } from '@vue/test-utils';
import { describe, it, expect, vi } from 'vitest';
import 'fake-indexeddb/auto';
import PortfolioPage from '../src/pages/PortfolioPage.vue';
import { createPinia, setActivePinia } from 'pinia';

vi.mock('../src/services/MarketstackService', () => ({
  MarketstackService: vi.fn().mockImplementation(() => ({
    getQuote: vi.fn().mockResolvedValue({
      symbol: 'AAPL',
      price: 1,
      open: 1,
      high: 1,
      low: 1,
      close: 1
    })
  }))
}));

describe('PortfolioPage mirror', () => {
  setActivePinia(createPinia());
  it('shows expected text', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.text()).toContain('Portfolio Page');
  });

  it('does not show wrong text', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.text()).not.toContain('Wrong');
  });
});
