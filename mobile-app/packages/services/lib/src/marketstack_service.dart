import 'lru_cache.dart';
import 'api_quota_ledger.dart';

/// S-01 – MarketstackService
class MarketstackService {
  final LruCache<String, Map<String, dynamic>> _cache = LruCache(32);
  final ApiQuotaLedger _ledger = ApiQuotaLedger(100);

  Future<Map<String, dynamic>> getIndexQuote(String symbol) async {
    final cached = _cache.get(symbol);
    if (cached != null) return cached;
    if (!_ledger.isSafe()) throw Exception('quota exceeded');
    _ledger.increment();
    final result = {'symbol': symbol, 'price': 123.45};
    _cache.put(symbol, result, const Duration(hours: 24));
    return result;
  }

  Future<List<Map<String, dynamic>>> getSeries(String symbol) async {
    if (!_ledger.isSafe()) throw Exception('quota exceeded');
    _ledger.increment();
    return [
      {'symbol': symbol, 'close': 120.0},
      {'symbol': symbol, 'close': 121.0},
    ];
  }
}
