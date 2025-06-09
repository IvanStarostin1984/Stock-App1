import 'lru_cache.dart';
import 'api_quota_ledger.dart';
import 'fetch_json.dart';

/// S-03 – NewsService
class NewsService {
  final LruCache<String, List<Map<String, dynamic>>> _cache = LruCache(32);
  final ApiQuotaLedger _ledger = ApiQuotaLedger(200);

  Future<List<Map<String, dynamic>>?> getDigest(String topic) async {
    final url = 'https://newsdata.io/api/1/news?q=$topic&language=en';
    return fetchJson<List<Map<String, dynamic>>>(
      url,
      _cache,
      _ledger,
      (json) {
        final results = json['results'] as List? ?? [];
        return results.take(3).map((n) {
          return {
            'title': n['title'],
            'url': n['link'],
          };
        }).toList();
      },
    );
  }
}
