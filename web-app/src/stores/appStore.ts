import { defineStore } from 'pinia';
import { MarketstackService, type Quote } from '@/services/MarketstackService';
import { QuoteRepository } from '@/repositories/QuoteRepository';
import { NewsService, type NewsArticle } from '@/services/NewsService';
import { FxService } from '@/services/FxService';
import { LocationService } from '@/services/LocationService';
import {
  CountrySettingRepository,
  type CountrySetting
} from '@/repositories/CountrySettingRepository';
import { SymbolTrie } from '@/utils/SymbolTrie';

export interface AppState {
  headline: Quote | null;
  articles: NewsArticle[] | null;
  currency: string;
  isPro: boolean;
  searchResults: string[];
  topGainers: Quote[];
  topLosers: Quote[];
  countryCode: string | null;
}

export interface AppDeps {
  quoteRepo?: QuoteRepository;
  newsService?: NewsService;
  fxService?: FxService;
  trie?: SymbolTrie;
  locationService?: LocationService;
  countryRepo?: CountrySettingRepository;
}

export function createAppStore(deps: AppDeps = {}) {
  return defineStore('app', {
    state: (): AppState => ({
      headline: null,
      articles: null,
      currency: 'USD',
      isPro: false,
      searchResults: [],
      topGainers: [],
      topLosers: [],
      countryCode: null
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
        const fxSvc = deps.fxService ?? new FxService();
        const rate = await fxSvc.getRate(this.currency, target);
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
        this.isPro = true;
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
        // placeholder for future sync logic
      }
    }
  });
}

export const useAppStore = createAppStore();
