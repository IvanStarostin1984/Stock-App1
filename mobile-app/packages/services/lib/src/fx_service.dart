import 'lru_cache.dart';
import 'api_quota_ledger.dart';
import 'fetch_json.dart';
import 'package:http/http.dart' as http;

/// S-02 – FxService
class FxService {
  final LruCache<String, double> _cache = LruCache(16);
  final ApiQuotaLedger _ledger;
  late final NetClient _net;

  FxService([http.Client? client]) : _ledger = ApiQuotaLedger(100) {
    _net = NetClient(_ledger, client);
  }

  Future<double?> getRate(String from, String to) async {
    final url = 'https://api.exchangerate.host/latest?base=$from&symbols=$to';
    return _net.get<double>(
      url,
      _cache,
      (json) => (json['rates'] as Map<String, dynamic>)[to].toDouble(),
      ttl: const Duration(hours: 24),
    );
  }
}
