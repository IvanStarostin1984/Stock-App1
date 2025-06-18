import 'lru_cache.dart';
import 'api_quota_ledger.dart';
import 'fetch_json.dart';
import 'package:http/http.dart' as http;
import 'package:xml/xml.dart';

/// S-03 – NewsService
class NewsService {
  final LruCache<String, List<Map<String, dynamic>>> _cache = LruCache(32);
  final LruCache<String, List<Map<String, dynamic>>> _rssCache = LruCache(4);
  final ApiQuotaLedger _ledger;
  final http.Client _client;
  late final NetClient _net;
  final String _apiKey;
  static const _rssUrl =
      'https://rss.theguardian.com/business/markets/index.xml';

  NewsService(this._apiKey, {ApiQuotaLedger? ledger, http.Client? client})
      : _ledger = ledger ?? ApiQuotaLedger(200),
        _client = client ?? http.Client() {
    if (_apiKey.trim().isEmpty) {
      throw ArgumentError('Newsdata API key is required');
    }
    _net = NetClient(_ledger, _client);
  }

  Future<List<Map<String, dynamic>>?> getDigest(String topic) async {
    if (!_ledger.isSafe()) {
      return null;
    }
    final url =
        'https://newsdata.io/api/1/news?apikey=$_apiKey&q=$topic&language=en';
    final articles = await _net.get<List<Map<String, dynamic>>>(
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
    return articles ?? await _fetchRss();
  }

  Future<List<Map<String, dynamic>>?> _fetchRss() async {
    final cached = _rssCache.get(_rssUrl);
    if (cached != null) return cached;
    try {
      final resp = await _client.get(Uri.parse(_rssUrl));
      if (resp.statusCode != 200) return null;
      final doc = XmlDocument.parse(resp.body);
      final items = doc.findAllElements('item').take(3).map((n) {
        return {
          'title': n.getElement('title')?.text ?? '',
          'url': n.getElement('link')?.text ?? '',
          'source': 'rss',
          'published': n.getElement('pubDate')?.text ?? '',
        };
      }).toList();
      _rssCache.put(_rssUrl, items, const Duration(hours: 12));
      return items;
    } catch (_) {
      return null;
    }
  }
}
