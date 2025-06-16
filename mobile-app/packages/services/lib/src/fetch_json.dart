import 'dart:convert';
import 'package:http/http.dart' as http;

import 'lru_cache.dart';
import 'api_quota_ledger.dart';

/// Simple network client used by the services package.
///
/// Mirrors the web NetClient implementation. Each instance holds an
/// [http.Client] that can be swapped in tests.
class NetClient {
  final http.Client _client;

  NetClient([http.Client? client]) : _client = client ?? http.Client();

  /// Fetch JSON from [url] applying [cache] and [ledger].
  Future<T?> fetchJson<T>(
    String url,
    LruCache<String, T> cache,
    ApiQuotaLedger ledger,
    T Function(dynamic json) transform,
  ) async {
    final cached = cache.get(url);
    if (cached != null) return cached;
    if (!ledger.isSafe()) return null;
    try {
      final resp = await _client.get(Uri.parse(url));
      if (resp.statusCode != 200) return null;
      final json = jsonDecode(resp.body);
      ledger.increment();
      final data = transform(json);
      cache.put(url, data, const Duration(hours: 24));
      return data;
    } catch (_) {
      return null;
    }
  }
}
