import 'package:smwa_services/services.dart';
import '../models/news_article.dart';
import 'package:smwa_services/src/lru_cache.dart';

/// R-05 – Provides cached news articles via [NewsService].
class NewsRepository {
  final NewsService _svc;
  final LruCache<String, List<NewsArticle>> _cache = LruCache(32);

  NewsRepository({NewsService? service})
      : _svc = service ??
            NewsService(const String.fromEnvironment('VITE_NEWSDATA_KEY'));

  /// Returns up to three recent articles for [symbol] using a 12h cache.
  Future<List<NewsArticle>?> digest(String symbol) async {
    final cached = _cache.get(symbol);
    if (cached != null) return cached;
    final raw = await _svc.getDigest(symbol);
    if (raw == null) return null;
    final list = raw.map((e) => NewsArticle.fromMap(e)).toList();
    _cache.put(symbol, list, const Duration(hours: 12));
    return list;
  }
}
