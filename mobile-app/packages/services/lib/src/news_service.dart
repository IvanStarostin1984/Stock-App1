import 'lru_cache.dart';
import 'api_quota_ledger.dart';

/// S-03 – NewsService
class NewsService {
  final LruCache<String, List<Map<String, dynamic>>> _cache = LruCache(32);
  final ApiQuotaLedger _ledger = ApiQuotaLedger(200);

  Future<List<Map<String, dynamic>>> getDigest(String topic) async {
    final cached = _cache.get(topic);
    if (cached != null) return cached;
    if (!_ledger.isSafe()) throw Exception('quota exceeded');
    _ledger.increment();
    final news = [
      {'title': 'Example', 'url': 'https://example.com'}
    ];
    _cache.put(topic, news, const Duration(hours: 24));
    return news;
  }
}
