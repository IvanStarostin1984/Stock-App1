import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import '../models/portfolio_holding.dart';
import '../models/quote.dart';
import 'quote_repository.dart';
import 'package:smwa_services/src/lru_cache.dart';

/// R-02 – CRUD access to portfolio holdings using SharedPreferences.
class PortfolioRepository {
  final String _storeKey = 'holdings';
  final QuoteRepository _quoteRepo;
  final LruCache<String, double> _totalCache = LruCache(1);

  PortfolioRepository({QuoteRepository? quoteRepo})
      : _quoteRepo = quoteRepo ?? QuoteRepository();

  Future<SharedPreferences> get _prefs async =>
      await SharedPreferences.getInstance();

  /// Returns all saved holdings.
  Future<List<PortfolioHolding>> list() async {
    final prefs = await _prefs;
    final jsonStr = prefs.getString(_storeKey);
    if (jsonStr == null) return [];
    final List<dynamic> data = json.decode(jsonStr);
    return data
        .map((e) => PortfolioHolding.fromMap(e as Map<String, dynamic>))
        .toList();
  }

  /// Adds a holding after validating fields.
  Future<void> add(PortfolioHolding h) async {
    if (h.symbol.isEmpty || h.quantity <= 0 || h.buyPrice <= 0) {
      throw ArgumentError('Invalid holding');
    }
    final prefs = await _prefs;
    final items = await list();
    items.add(h);
    await prefs.setString(
        _storeKey, json.encode(items.map((e) => e.toMap()).toList()));
    _totalCache.delete('total');
  }

  /// Removes a holding by [id].
  Future<void> remove(String id) async {
    final prefs = await _prefs;
    final items = await list();
    items.removeWhere((e) => e.id == id);
    await prefs.setString(
        _storeKey, json.encode(items.map((e) => e.toMap()).toList()));
    _totalCache.delete('total');
  }

  /// Recalculate total value using cached quotes with 1h cache.
  Future<double> refreshTotals() async {
    final cached = _totalCache.get('total');
    if (cached != null) return cached;
    final holdings = await list();
    double total = 0;
    for (final h in holdings) {
      final Quote? q = await _quoteRepo.headline(h.symbol);
      if (q != null) total += q.price * h.quantity;
    }
    _totalCache.put('total', total, const Duration(hours: 1));
    return total;
  }
}
