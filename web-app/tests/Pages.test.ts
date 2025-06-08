import { mount } from '@vue/test-utils';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import MainPage from '../src/pages/MainPage.vue';
import DetailPage from '../src/pages/DetailPage.vue';
import NewsPricesPage from '../src/pages/NewsPricesPage.vue';
import ProPage from '../src/pages/ProPage.vue';
import SearchPage from '../src/pages/SearchPage.vue';
import PortfolioPage from '../src/pages/PortfolioPage.vue';
import { useRoute } from 'vue-router';

let storeMock: any;
vi.mock('../src/stores/appStore', () => ({
  useAppStore: () => storeMock
}));

vi.mock('vue-router', () => ({ useRoute: vi.fn() }));
const mockedUseRoute = useRoute as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  setActivePinia(createPinia());
  storeMock = {
    loadHeadline: vi.fn(),
    loadTopMovers: vi.fn(),
    toggleCurrency: vi.fn(),
    signIn: vi.fn(),
    search: vi.fn().mockReturnValue([]),
    upgradePro: vi.fn(),
    syncWatchList: vi.fn(),
    topGainers: [],
    topLosers: []
  };
});

describe('MainPage', () => {
  it('renders heading', () => {
    const wrapper = mount(MainPage);
    expect(wrapper.find('h1').text()).toBe('Main Page');
  });

  it('does not render h2', () => {
    const wrapper = mount(MainPage);
    expect(wrapper.find('h2').exists()).toBe(false);
  });
});

describe('DetailPage', () => {
  it('shows symbol from route params', () => {
    mockedUseRoute.mockReturnValue({ params: { symbol: 'ABC' } });
    const wrapper = mount(DetailPage);
    expect(wrapper.text()).toContain('ABC');
  });

  it('handles missing symbol', () => {
    mockedUseRoute.mockReturnValue({ params: {} });
    const wrapper = mount(DetailPage);
    expect(wrapper.text()).not.toContain('ABC');
  });
});

describe('NewsPricesPage', () => {
  it('renders heading', () => {
    const wrapper = mount(NewsPricesPage);
    expect(wrapper.find('h1').text()).toBe('News & Prices');
    expect(storeMock.loadTopMovers).toHaveBeenCalled();
  });

  it('shows movers lists', () => {
    storeMock.topGainers = [
      { symbol: 'A', price: 1, open: 1, high: 1, low: 1, close: 1 }
    ];
    storeMock.topLosers = [
      { symbol: 'B', price: 2, open: 2, high: 2, low: 2, close: 2 }
    ];
    const wrapper = mount(NewsPricesPage);
    expect(wrapper.text()).toContain('Top Gainers');
    expect(wrapper.text()).toContain('A 1');
    expect(wrapper.text()).toContain('Top Losers');
    expect(wrapper.text()).toContain('B 2');
  });
});

describe('ProPage', () => {
  it('renders heading', () => {
    const wrapper = mount(ProPage);
    expect(wrapper.find('h1').text()).toBe('Pro Page');
  });

  it('no extra heading present', () => {
    const wrapper = mount(ProPage);
    expect(wrapper.find('h2').exists()).toBe(false);
  });
});

describe('SearchPage', () => {
  it('renders heading', () => {
    const wrapper = mount(SearchPage);
    expect(wrapper.find('h1').text()).toBe('Search Page');
  });

  it('no extra heading present', () => {
    const wrapper = mount(SearchPage);
    expect(wrapper.find('h2').exists()).toBe(false);
  });
});

describe('PortfolioPage', () => {
  it('renders heading', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.find('h1').text()).toBe('Portfolio Page');
  });

  it('no extra heading present', () => {
    const wrapper = mount(PortfolioPage);
    expect(wrapper.find('h2').exists()).toBe(false);
  });
});
