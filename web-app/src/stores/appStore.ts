/* eslint-env browser */
import { defineStore } from 'pinia';
import { MarketstackService, type Quote } from '@/services/MarketstackService';
import { QuoteRepository } from '@/repositories/QuoteRepository';
import { NewsService, type NewsArticle } from '@/services/NewsService';
import { FxService } from '@/services/FxService';
import { FxRepository } from '@/repositories/FxRepository';
import { LocationService } from '@/services/LocationService';
import { ProUpgradeService } from '@/services/ProUpgradeService';
import {
  CountrySettingRepository,
  type CountrySetting
} from '@/repositories/CountrySettingRepository';
import { SymbolTrie } from '@/utils/SymbolTrie';
import { WatchListRepository } from '@/repositories/WatchListRepository';
import {
  PortfolioRepository,
  type PortfolioHolding
} from '@/repositories/PortfolioRepository';

export interface AppState {
  headline: Quote | null;
  articles: NewsArticle[] | null;
  currency: string;
  isPro: boolean;
  searchResults: string[];
  topGainers: Quote[];
  topLosers: Quote[];
  countryCode: string | null;
  holdings: PortfolioHolding[];
  portfolioTotal: number;
}

export interface AppDeps {
  quoteRepo?: QuoteRepository;
  newsService?: NewsService;
  fxRepo?: FxRepository;
  trie?: SymbolTrie;
  locationService?: LocationService;
  countryRepo?: CountrySettingRepository;
  proService?: import('@/services/ProUpgradeService').ProUpgradeService;
  watchRepo?: WatchListRepository;
  portfolioRepo?: PortfolioRepository;
}

export function createAppStore(deps: AppDeps = {}) {
  const useStore = defineStore('app', {
    state: (): AppState => ({
      headline: null,
      articles: null,
      currency: 'USD',
      isPro: false,
      searchResults: [],
      topGainers: [],
      topLosers: [],
      countryCode: null,
      holdings: [],
      portfolioTotal: 0
    }),
    actions: {
      async loadHeadline(symbol: string = 'AAPL') {
        const repo =
          deps.quoteRepo ??
          new QuoteRepository(
            new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY ?? '')
          );
        const newsSvc =
          deps.newsService ??
          new NewsService(import.meta.env.VITE_NEWSDATA_KEY ?? '');
        this.headline = await repo.headline(symbol);
        this.articles = this.headline ? await newsSvc.getNews(symbol) : null;
      },
      async loadTopMovers() {
        const repo =
          deps.quoteRepo ??
          new QuoteRepository(
            new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY ?? '')
          );
        const res = await repo.topMovers();
        this.topGainers = res?.gainers ?? [];
        this.topLosers = res?.losers ?? [];
      },
      async toggleCurrency() {
        const target = this.currency === 'USD' ? 'EUR' : 'USD';
        const repo =
          deps.fxRepo ?? new FxRepository(new FxService());
        const rate = await repo.rate(this.currency, target);
        if (rate !== null) this.currency = target;
      },
      signIn() {
        this.isPro = true;
      },
      search(term: string): string[] {
        const trie = deps.trie ?? new SymbolTrie();
        this.searchResults = trie.search(term, 5);
        return this.searchResults;
      },
      async upgradePro() {
        const svc = deps.proService ?? new ProUpgradeService();
        const ok = await svc.checkoutMock();
        if (ok) this.isPro = true;
      },
      async initLocation() {
        const repo =
          deps.countryRepo ?? new CountrySettingRepository();
        let setting: CountrySetting | null = await repo.load();
        if (!setting) {
          const svc = deps.locationService ?? new LocationService(repo);
          try {
            setting = await svc.resolveCountry();
          } catch {
            setting = null;
          }
        }
        if (setting) {
          this.countryCode = setting.iso2;
          this.currency = setting.lastCurrency;
        }
      },
      async syncWatchList() {
        if (typeof localStorage === 'undefined') return;
        const repo = deps.watchRepo ?? new WatchListRepository();
        const list = await repo.list();
        await repo.save(list);
      },
      /** Add a symbol to the watch list if not already present. */
      async addToWatchList(symbol: string) {
        const repo = deps.watchRepo ?? new WatchListRepository();
        const list = await repo.list();
        if (!list.includes(symbol)) {
          list.push(symbol);
          await repo.save(list);
        }
      },
      /** Remove a symbol from the watch list. */
      async removeFromWatchList(symbol: string) {
        const repo = deps.watchRepo ?? new WatchListRepository();
        const list = await repo.list();
        const idx = list.indexOf(symbol);
        if (idx !== -1) {
          list.splice(idx, 1);
          await repo.save(list);
        }
      },
      /** Load portfolio holdings and total value. */
      async loadPortfolio() {
        const repo = deps.portfolioRepo ?? new PortfolioRepository();
        this.holdings = await repo.list();
        this.portfolioTotal = await repo.refreshTotals();
      },
      /** Add a holding then refresh totals. */
      async addHolding(h: PortfolioHolding) {
        const repo = deps.portfolioRepo ?? new PortfolioRepository();
        await repo.add(h);
        await this.loadPortfolio();
      },
      /** Remove a holding by id then refresh totals. */
      async removeHolding(id: string) {
        const repo = deps.portfolioRepo ?? new PortfolioRepository();
        await repo.remove(id);
        await this.loadPortfolio();
      }
    }
  });

  return () => {
    const store = useStore();
    if (deps.portfolioRepo) {
      const repo = deps.portfolioRepo;
      const now = new Date();
      const delay =
        (60 - now.getMinutes()) * 60_000 - now.getSeconds() * 1000;
      const tick = async () => {
        store.portfolioTotal = await repo.refreshTotals();
      };
      globalThis.setTimeout(() => {
        tick();
        globalThis.setInterval(tick, 60 * 60 * 1000);
      }, delay);
    }
    return store;
  };
}

export const useAppStore = createAppStore();
