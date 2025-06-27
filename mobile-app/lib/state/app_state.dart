import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:smwa_services/services.dart' as svc
    show AuthService, ProUpgradeService;
import '../repositories/quote_repository.dart';
import '../models/quote.dart';
import '../models/news_article.dart';
import '../repositories/news_repository.dart';
import '../repositories/watch_list_repository.dart';
import '../repositories/fx_repository.dart';
import '../repositories/credential_store.dart';

/// Simple state container used by the app.
class AppState {
  final int count;
  final Quote? headline;
  final List<NewsArticle>? articles;
  final String currency;

  const AppState(
      {this.count = 0, this.headline, this.articles, this.currency = 'USD'});

  AppState copyWith({
    int? count,
    Quote? headline,
    List<NewsArticle>? articles,
    String? currency,
  }) {
    return AppState(
      count: count ?? this.count,
      headline: headline ?? this.headline,
      articles: articles ?? this.articles,
      currency: currency ?? this.currency,
    );
  }
}

/// Application level state provider managing market data.
class AppStateNotifier extends StateNotifier<AppState> {
  final QuoteRepository _quotes;
  final NewsRepository _news;
  final svc.AuthService _auth;
  final WatchListRepository _watchRepo;
  final FxRepository _fx;
  final CredentialStore _cred;
  final svc.ProUpgradeService _proSvc;

  AppStateNotifier._(this._quotes, this._news, this._auth, this._watchRepo,
      this._fx, this._cred, this._proSvc)
      : super(const AppState());

  /// Creates an [AppStateNotifier] with optional service overrides.
  factory AppStateNotifier({
    QuoteRepository? quotes,
    NewsRepository? news,
    svc.AuthService? auth,
    WatchListRepository? watchRepo,
    FxRepository? fxRepo,
    CredentialStore? credStore,
    svc.ProUpgradeService? proSvc,
  }) {
    final store = credStore ?? CredentialStore();
    return AppStateNotifier._(
      quotes ?? QuoteRepository(),
      news ?? NewsRepository(),
      auth ?? svc.AuthService(),
      watchRepo ?? WatchListRepository(),
      fxRepo ?? FxRepository(),
      store,
      proSvc ?? svc.ProUpgradeService(store.updateProFlag),
    );
  }

  /// Increments the counter by one.
  void increment() => state = state.copyWith(count: state.count + 1);

  /// Resets the counter to zero.
  void reset() => state = state.copyWith(count: 0);

  /// Toggles the display currency between USD and EUR.
  Future<void> toggleCurrency() async {
    final target = state.currency == 'USD' ? 'EUR' : 'USD';
    final rate = await _fx.rate(state.currency, target);
    if (rate != null) {
      state = state.copyWith(currency: target);
    }
  }

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
  Future<UserCredential> register(String email, String password) async {
    return _auth.register(email, password);
  }

  /// Loads and re-saves the watch list.
  Future<void> syncWatchList() async {
    final list = await _watchRepo.list();
    await _watchRepo.save(list);
  }

  /// Performs the mock checkout and flips the Pro flag on success.
  Future<bool> upgradePro() async {
    return _proSvc.checkoutMock();
  }
}

/// Riverpod provider exposing the application state.
final authServiceProvider = Provider<svc.AuthService>((ref) => svc.AuthService());

final appStateProvider = StateNotifierProvider<AppStateNotifier, AppState>(
  (ref) => AppStateNotifier(auth: ref.read(authServiceProvider)),
);
