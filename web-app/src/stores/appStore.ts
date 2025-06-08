import { defineStore } from 'pinia';
import { MarketstackService, type Quote } from '@/services/MarketstackService';
import { NewsService, type NewsArticle } from '@/services/NewsService';
import { FxService } from '@/services/FxService';
import { SymbolTrie } from '@/utils/SymbolTrie';

export interface AppState {
  headline: Quote | null;
  articles: NewsArticle[] | null;
  currency: string;
  isPro: boolean;
  searchResults: string[];
  topGainers: Quote[];
  topLosers: Quote[];
}

export interface AppDeps {
  quoteService?: MarketstackService;
  newsService?: NewsService;
  fxService?: FxService;
  trie?: SymbolTrie;
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
      topLosers: []
    }),
    actions: {
      async loadHeadline(symbol: string = 'AAPL') {
        const quoteSvc =
          deps.quoteService ??
          new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY ?? '');
        const newsSvc =
          deps.newsService ??
          new NewsService(import.meta.env.VITE_NEWSDATA_KEY ?? '');
        this.headline = await quoteSvc.getQuote(symbol);
        this.articles = this.headline ? await newsSvc.getNews(symbol) : null;
      },
      async loadTopMovers() {
        const quoteSvc =
          deps.quoteService ??
          new MarketstackService(import.meta.env.VITE_MARKETSTACK_KEY ?? '');
        const res = await quoteSvc.getTopMovers();
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
      async syncWatchList() {
        // placeholder for future sync logic
      }
    }
  });
}

export const useAppStore = createAppStore();
