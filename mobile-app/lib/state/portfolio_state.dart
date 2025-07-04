import 'dart:async';
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
  Timer? _timer;

  PortfolioNotifier({PortfolioRepository? repo})
      : _repo = repo ?? PortfolioRepository(),
        super(const PortfolioState()) {
    final now = DateTime.now();
    final delay = Duration(
      minutes: 60 - now.minute,
      seconds: -now.second,
    );
    _timer = Timer(delay, () {
      _tick();
      _timer = Timer.periodic(const Duration(hours: 1), (_) => _tick());
    });
  }

  Future<void> _tick() async {
    final total = await _repo.refreshTotals();
    state = state.copyWith(total: total);
  }

  @override
  void dispose() {
    _timer?.cancel();
    super.dispose();
  }

  /// Loads holdings and total value from the repository.
  Future<void> load() async {
    final items = await _repo.list();
    final total = await _repo.refreshTotals();
    state = PortfolioState(holdings: items, total: total);
  }

  /// Adds a [holding] through the repository and reloads state.
  Future<void> addHolding(PortfolioHolding holding) async {
    await _repo.add(holding);
    await load();
  }

  /// Removes a holding by [id] and reloads state.
  Future<void> removeHolding(String id) async {
    await _repo.remove(id);
    await load();
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
