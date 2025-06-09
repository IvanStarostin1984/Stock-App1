import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smwa_services/services.dart';
import '../models/quote.dart';
import '../models/news_article.dart';

/// Simple state container used by the app.
class AppState {
  final int count;
  final Quote? headline;
  final List<NewsArticle>? articles;

  const AppState({this.count = 0, this.headline, this.articles});

  AppState copyWith(
      {int? count, Quote? headline, List<NewsArticle>? articles}) {
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
    if (data.isNotEmpty) {
      q = Quote(
          symbol: data['symbol'] as String,
          price: (data['price'] as num).toDouble());
    }
    final rawNews = q != null ? await _news.getDigest(symbol) : null;
    final articles = rawNews?.map((e) => NewsArticle.fromMap(e)).toList();
    state = state.copyWith(headline: q, articles: articles);
  }
}

/// Riverpod provider exposing the application state.
final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>(
    (ref) => AppStateNotifier());
