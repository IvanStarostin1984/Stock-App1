import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smwa_services/services.dart';
import '../repositories/quote_repository.dart';
import '../models/quote.dart';
import '../models/news_article.dart';
import '../repositories/news_repository.dart';
import '../repositories/watch_list_repository.dart';

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
  final QuoteRepository _quotes;
  final NewsRepository _news;
  final AuthService _auth;
  final WatchListRepository _watchRepo;

  /// Creates an [AppStateNotifier] with optional service overrides.
  AppStateNotifier(
      {QuoteRepository? quotes,
      NewsRepository? news,
      AuthService? auth,
      WatchListRepository? watchRepo})
      : _quotes = quotes ?? QuoteRepository(),
        _news = news ?? NewsRepository(),
        _auth = auth ?? AuthService(),
        _watchRepo = watchRepo ?? WatchListRepository(),
        super(const AppState());

  /// Increments the counter by one.
  void increment() => state = state.copyWith(count: state.count + 1);

  /// Resets the counter to zero.
  void reset() => state = state.copyWith(count: 0);

  /// Loads the headline quote and related news articles.
  Future<void> loadHeadline([String symbol = 'AAPL']) async {
    final q = await _quotes.headline(symbol);
    final articles = q != null ? await _news.digest(symbol) : null;
    state = state.copyWith(headline: q, articles: articles);
  }

  /// Attempts to log in via [AuthService].
  Future<bool> signIn(String email, String password) async {
    return _auth.login(email, password);
  }

  /// Registers a new account via [AuthService].
  Future<Map<String, dynamic>> register(String email, String password) async {
    return _auth.register(email, password);
  }

  /// Loads and re-saves the watch list.
  Future<void> syncWatchList() async {
    final list = await _watchRepo.list();
    await _watchRepo.save(list);
  }
}

/// Riverpod provider exposing the application state.
final authServiceProvider = Provider<AuthService>((ref) => AuthService());

final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>(
  (ref) => AppStateNotifier(auth: ref.read(authServiceProvider)),
);
