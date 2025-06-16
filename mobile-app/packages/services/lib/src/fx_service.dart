import 'lru_cache.dart';
import 'api_quota_ledger.dart';
import 'fetch_json.dart';

/// S-02 – FxService
class FxService {
  final NetClient _net;
  final LruCache<String, double> _cache = LruCache(16);
  final ApiQuotaLedger _ledger = ApiQuotaLedger(100);

  FxService([NetClient? client]) : _net = client ?? NetClient();

  Future<double?> getRate(String from, String to) async {
    final key = '$from-$to';
    final url = 'https://api.exchangerate.host/latest?base=$from&symbols=$to';
    return _net.fetchJson<double>(
      url,
      _cache,
      _ledger,
      (json) => (json['rates'] as Map<String, dynamic>)[to].toDouble(),
    );
  }
}
