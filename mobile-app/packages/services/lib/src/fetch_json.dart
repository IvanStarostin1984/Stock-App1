import 'dart:convert';
import 'package:http/http.dart' as http;

import 'lru_cache.dart';
import 'api_quota_ledger.dart';

/// Helper for fetching JSON with caching and quota control.
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
    final resp = await httpClient.get(Uri.parse(url));
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

/// HTTP client used by [fetchJson]. Override in tests.
http.Client httpClient = http.Client();
