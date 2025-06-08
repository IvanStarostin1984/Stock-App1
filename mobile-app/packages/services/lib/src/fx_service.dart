import 'lru_cache.dart';
import 'api_quota_ledger.dart';

/// S-02 – FxService
class FxService {
  final LruCache<String, Map<String, dynamic>> _cache = LruCache(16);
  final ApiQuotaLedger _ledger = ApiQuotaLedger(100);

  Future<Map<String, dynamic>> getRate(String from, String to) async {
    final key = '$from-$to';
    final cached = _cache.get(key);
    if (cached != null) return cached;
    if (!_ledger.isSafe()) throw Exception('quota exceeded');
    _ledger.increment();
    final rate = {'rate': 1.1};
    _cache.put(key, rate, const Duration(hours: 24));
    return rate;
  }
}
