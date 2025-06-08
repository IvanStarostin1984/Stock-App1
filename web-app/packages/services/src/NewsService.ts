import { LruCache } from '../../../src/utils/LruCache';
import { ApiQuotaLedger } from '../../../src/utils/ApiQuotaLedger';
import { fetchCached } from '../../../../packages/core/src/net';

export interface NewsArticle {
  title: string;
  url: string;
  source: string;
  published: string;
}

interface NewsApiEntry {
  title: string;
  link: string;
  source_id: string;
  pubDate: string;
}

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12h

/**
 * Service for fetching recent news articles for a stock symbol.
 */
export class NewsService {
  private cache = new LruCache<string, NewsArticle[]>(32);
  private ledger = new ApiQuotaLedger(200); // 200 req/day
  private apiKey: string;
  constructor(apiKey: string) {
    if (typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('Newsdata API key is required');
    }
    this.apiKey = apiKey;
  }

  /**
   * Retrieve up to three recent articles about the given symbol.
   *
   * API usage is accounted for using the quota ledger and results
   * are cached for twelve hours.
   *
   * @param symbol - Stock ticker symbol.
   * @returns A list of news articles or `null` on failure.
   */
  async getNews(symbol: string): Promise<NewsArticle[] | null> {
    const url = `https://newsdata.io/api/1/news?apikey=${this.apiKey}&q=${symbol}&language=en`;
    return fetchCached(
      this.cache,
      this.ledger,
      symbol,
      url,
      CACHE_TTL,
      (data: { results?: NewsApiEntry[] }) => {
        const results: NewsApiEntry[] = data.results ?? [];
        return results.slice(0, 3).map(({ title, link, source_id, pubDate }) => ({
          title,
          url: link,
          source: source_id,
          published: pubDate
        }));
      },
      'NewsService.getNews'
    );
  }
}
