import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/lru_cache.dart';

/// FR-0107 – Provides cached access to FX rates via [FxService].
class FxRepository {
  final FxService _svc;
  final LruCache<String, double> _cache = LruCache(32);

  FxRepository({FxService? service}) : _svc = service ?? FxService();

  /// Returns the conversion rate from [base] to [quote] using a 24h cache.
  Future<double?> rate(String base, String quote) async {
    final key = '${base}_${quote}';
    final cached = _cache.get(key);
    if (cached != null) return cached;
    final value = await _svc.getRate(base, quote);
    if (value != null) _cache.put(key, value, const Duration(hours: 24));
    return value;
  }
}
