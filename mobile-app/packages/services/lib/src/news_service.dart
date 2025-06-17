import 'lru_cache.dart';
import 'api_quota_ledger.dart';
import 'fetch_json.dart';
import 'package:http/http.dart' as http;

/// S-03 – NewsService
class NewsService {
  final LruCache<String, List<Map<String, dynamic>>> _cache = LruCache(32);
  final ApiQuotaLedger _ledger;
  late final NetClient _net;
  final String _apiKey;

  NewsService(this._apiKey, {ApiQuotaLedger? ledger, http.Client? client})
      : _ledger = ledger ?? ApiQuotaLedger(200) {
    if (_apiKey.trim().isEmpty) {
      throw ArgumentError('Newsdata API key is required');
    }
    _net = NetClient(_ledger, client);
  }

  Future<List<Map<String, dynamic>>?> getDigest(String topic) async {
    final url =
        'https://newsdata.io/api/1/news?apikey=$_apiKey&q=$topic&language=en';
    return _net.get<List<Map<String, dynamic>>>(
      url,
      _cache,
      (json) {
        final results = json['results'] as List? ?? [];
        return results.take(3).map((n) {
          return {
            'title': n['title'],
            'url': n['link'],
            'source': n['source_id'],
            'published': n['pubDate'],
          };
        }).toList();
      },
      ttl: const Duration(hours: 12),
    );
  }
}
