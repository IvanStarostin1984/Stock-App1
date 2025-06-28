import 'package:smwa_services/services.dart';
import '../models/quote.dart';

/// R-01 – Provides cached access to quotes via [MarketstackService].
class QuoteRepository {
  final MarketstackService _svc;
  final LruCache<String, Quote> _headlineCache = LruCache(32);
  final LruCache<String, List<Quote>> _seriesCache = LruCache(32);

  QuoteRepository({MarketstackService? service})
      : _svc = service ?? MarketstackService();

  /// Returns the latest quote for [symbol] using a 24h cache.
  Future<Quote?> headline([String symbol = 'AAPL']) async {
    final cached = _headlineCache.get(symbol);
    if (cached != null) return cached;
    final data = await _svc.getIndexQuote(symbol);
    if (data == null || data.isEmpty) return null;
    final quote = Quote(
      symbol: data['symbol'] as String,
      price: (data['price'] as num).toDouble(),
      open: (data['open'] as num).toDouble(),
      high: (data['high'] as num).toDouble(),
      low: (data['low'] as num).toDouble(),
      close: (data['close'] as num).toDouble(),
    );
    _headlineCache.put(symbol, quote, const Duration(hours: 24));
    return quote;
  }

  /// Returns a short price series for [symbol] using a 24h cache.
  Future<List<Quote>?> series(String symbol) async {
    final cached = _seriesCache.get(symbol);
    if (cached != null) return cached;
    final data = await _svc.getSeries(symbol);
    if (data == null) return null;
    final list = data
        .map((e) => Quote(
              symbol: e['symbol'] as String,
              price: (e['close'] as num).toDouble(),
              open: (e['open'] as num).toDouble(),
              high: (e['high'] as num).toDouble(),
              low: (e['low'] as num).toDouble(),
              close: (e['close'] as num).toDouble(),
            ))
        .toList();
    _seriesCache.put(symbol, list, const Duration(hours: 24));
    return list;
  }
}
