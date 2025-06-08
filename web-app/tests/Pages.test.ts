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

vi.mock('../src/stores/appStore', () => ({
  useAppStore: () => ({
    loadHeadline: vi.fn(),
    toggleCurrency: vi.fn(),
    signIn: vi.fn(),
    search: vi.fn().mockReturnValue([]),
    upgradePro: vi.fn(),
    syncWatchList: vi.fn()
  })
}));

vi.mock('vue-router', () => ({ useRoute: vi.fn() }));
const mockedUseRoute = useRoute as unknown as ReturnType<typeof vi.fn>;

beforeEach(() => {
  setActivePinia(createPinia());
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
  });

  it('no extra heading present', () => {
    const wrapper = mount(NewsPricesPage);
    expect(wrapper.find('h2').exists()).toBe(false);
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
