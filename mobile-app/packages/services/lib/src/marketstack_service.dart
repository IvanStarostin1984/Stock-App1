import 'lru_cache.dart';
import 'api_quota_ledger.dart';
import 'fetch_json.dart';
import 'package:http/http.dart' as http;

/// S-01 – MarketstackService
class MarketstackService {
  final LruCache<String, Map<String, dynamic>> _cache = LruCache(32);
  final LruCache<String, List<Map<String, dynamic>>> _seriesCache =
      LruCache(32);
  final ApiQuotaLedger _ledger;
  late final NetClient _net;

  MarketstackService([http.Client? client]) : _ledger = ApiQuotaLedger(100) {
    _net = NetClient(_ledger, client);
  }

  Future<Map<String, dynamic>?> getIndexQuote(String symbol) async {
    final url = 'https://api.marketstack.com/v1/eod/latest?symbols=$symbol';
    return _net.get<Map<String, dynamic>>(
      url,
      _cache,
      (json) {
        final raw = json['data'][0];
        return {'symbol': raw['symbol'], 'price': raw['close']};
      },
      ttl: const Duration(hours: 24),
    );
  }

  Future<List<Map<String, dynamic>>?> getSeries(String symbol) async {
    final url = 'https://api.marketstack.com/v1/eod?symbols=$symbol&limit=2';
    return _net.get<List<Map<String, dynamic>>>(
      url,
      _seriesCache,
      (json) => (json['data'] as List)
          .map((r) => {'symbol': r['symbol'], 'close': r['close']})
          .toList(),
      ttl: const Duration(hours: 24),
    );
  }
}
