import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../repositories/portfolio_repository.dart';
import '../models/portfolio_holding.dart';

/// State holding portfolio list and total value.
class PortfolioState {
  final List<PortfolioHolding> holdings;
  final double total;

  const PortfolioState({this.holdings = const [], this.total = 0});

  PortfolioState copyWith({List<PortfolioHolding>? holdings, double? total}) {
    return PortfolioState(
      holdings: holdings ?? this.holdings,
      total: total ?? this.total,
    );
  }
}

/// Notifier managing portfolio data via [PortfolioRepository].
class PortfolioNotifier extends StateNotifier<PortfolioState> {
  final PortfolioRepository _repo;

  PortfolioNotifier({PortfolioRepository? repo})
      : _repo = repo ?? PortfolioRepository(),
        super(const PortfolioState());

  /// Loads holdings and total value from the repository.
  Future<void> load() async {
    final items = await _repo.list();
    final total = await _repo.refreshTotals();
    state = PortfolioState(holdings: items, total: total);
  }
}

/// Provider exposing [PortfolioRepository].
final portfolioRepositoryProvider =
    Provider<PortfolioRepository>((ref) => PortfolioRepository());

/// Provider exposing [PortfolioNotifier].
final portfolioNotifierProvider =
    StateNotifierProvider<PortfolioNotifier, PortfolioState>((ref) {
  return PortfolioNotifier(repo: ref.read(portfolioRepositoryProvider));
});
