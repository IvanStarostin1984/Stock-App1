import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smwa_services/services.dart';
import '../models/quote.dart';

/// Simple state container used by the app.
class AppState {
  final int count;
  final Quote? headline;
  final List<Map<String, dynamic>>? articles;

  const AppState({this.count = 0, this.headline, this.articles});

  AppState copyWith(
      {int? count, Quote? headline, List<Map<String, dynamic>>? articles}) {
    return AppState(
      count: count ?? this.count,
      headline: headline ?? this.headline,
      articles: articles ?? this.articles,
    );
  }
}

/// Application level state provider managing market data.
class AppStateNotifier extends StateNotifier<AppState> {
  final MarketstackService _marketstack;
  final NewsService _news;

  /// Creates an [AppStateNotifier] with optional service overrides.
  AppStateNotifier({MarketstackService? marketstack, NewsService? news})
      : _marketstack = marketstack ?? MarketstackService(),
        _news = news ?? NewsService(),
        super(const AppState());

  /// Increments the counter by one.
  void increment() => state = state.copyWith(count: state.count + 1);

  /// Resets the counter to zero.
  void reset() => state = state.copyWith(count: 0);

  /// Loads the headline quote and related news articles.
  Future<void> loadHeadline([String symbol = 'AAPL']) async {
    final data = await _marketstack.getIndexQuote(symbol);
    Quote? q;
    if (data != null && data.isNotEmpty) {
      q = Quote(
          symbol: data['symbol'] as String,
          price: (data['price'] as num).toDouble());
    }
    final news = q != null ? await _news.getDigest(symbol) : null;
    state = state.copyWith(headline: q, articles: news);
  }
}

/// Riverpod provider exposing the application state.
final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>(
    (ref) => AppStateNotifier());
