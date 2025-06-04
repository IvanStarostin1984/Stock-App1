import { LruCache } from "@/utils/LruCache";
import { ApiQuotaLedger } from "@/utils/ApiQuotaLedger";

export interface NewsArticle {
  title: string;
  link: string;
  source: string;
  published: string;
}

const CACHE_TTL = 12 * 60 * 60 * 1000; // 12h

/**
 * Service for fetching recent news articles for a stock symbol.
 */
export class NewsService {
  private cache = new LruCache<string, NewsArticle[]>(32);
  private ledger = new ApiQuotaLedger(200); // 200 req/day
  constructor(private apiKey: string) {}

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
    const cached = this.cache.get(symbol);
    if (cached) return cached;
    if (!this.ledger.isSafe()) return null;
    const url = `https://newsdata.io/api/1/news?apikey=${this.apiKey}&q=${symbol}&language=en`;
    try {
      const resp = await fetch(url);
      if (!resp.ok) return null;
      this.ledger.increment();
      const data = await resp.json();
      const articles: NewsArticle[] = (data.results || [])
        .slice(0, 3)
        .map((a: any) => ({
          title: a.title,
          link: a.link,
          source: a.source_id,
          published: a.pubDate,
        }));
      this.cache.put(symbol, articles, CACHE_TTL);
      return articles;
    } catch {
      return null;
    }
  }
}
