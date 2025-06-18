import { LruCache } from '@/utils/LruCache';
import { ApiQuotaLedger } from '@/utils/ApiQuotaLedger';
import { logApiCall } from '@/utils/logMetrics';
import { NetClient, HALF_DAY_MS } from '../../../packages/core/net';
/* global DOMParser */

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

/**
 * Service for fetching recent news articles for a stock symbol.
 */
export class NewsService {
  private cache = new LruCache<string, NewsArticle[]>(32);
  private ledger = new ApiQuotaLedger(200); // 200 req/day
  private client = new NetClient(this.ledger);
  private apiKey: string;
  constructor(apiKey: string) {
    if (typeof apiKey !== 'string' || apiKey.trim() === '') {
      throw new Error('Newsdata API key is required');
    }
    this.apiKey = apiKey;
  }

  private parseRss(xml: string): NewsArticle[] {
    const doc = new DOMParser().parseFromString(xml, 'text/xml');
    const items = Array.from(doc.querySelectorAll('item')).slice(0, 3);
    return items.map(item => ({
      title: item.querySelector('title')?.textContent ?? '',
      url: item.querySelector('link')?.textContent ?? '',
      source: item.querySelector('source')?.textContent ?? 'rss',
      published: item.querySelector('pubDate')?.textContent ?? '',
    }));
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
    const start = performance.now();
    if (!this.ledger.isSafe()) return null;
    let articles = await this.client.get<NewsArticle[]>(
      url,
      this.cache,
      json => {
        const results: NewsApiEntry[] = json.results ?? [];
        return results.slice(0, 3).map(({ title, link, source_id, pubDate }) => ({
          title,
          url: link,
          source: source_id,
          published: pubDate,
        }));
      },
      HALF_DAY_MS
    );
    logApiCall('NewsService.getNews', start);
    if (articles) return articles;

    const rssUrl = 'https://rss.theguardian.com/business/markets/index.xml';
    const cached = this.cache.get(rssUrl);
    if (cached !== undefined) return cached;
    try {
      const resp = await fetch(rssUrl);
      if (!resp.ok) return null;
      const xml = await resp.text();
      articles = this.parseRss(xml);
      this.cache.put(rssUrl, articles, HALF_DAY_MS);
      return articles;
    } catch {
      return null;
    }
  }
}
