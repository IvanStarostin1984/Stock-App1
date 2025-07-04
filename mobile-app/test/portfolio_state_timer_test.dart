import 'package:flutter_test/flutter_test.dart';
import 'package:fake_async/fake_async.dart';
import 'package:mobile_app/state/portfolio_state.dart';
import 'package:mobile_app/repositories/portfolio_repository.dart';
import 'package:mobile_app/models/portfolio_holding.dart';
import 'package:mobile_app/repositories/quote_repository.dart';

class _FakeRepo extends PortfolioRepository {
  int calls = 0;
  _FakeRepo() : super(quoteRepo: QuoteRepository());
  @override
  Future<double> refreshTotals() async {
    calls++;
    return 1;
  }

  @override
  Future<List<PortfolioHolding>> list() async => [];
}

void main() {
  test('refreshTotals called on hourly timer', () {
    fakeAsync((async) {
      final repo = _FakeRepo();
      final now = DateTime.now();
      final delay =
          Duration(minutes: 60 - now.minute, seconds: -now.second);
      final notifier = PortfolioNotifier(repo: repo);
      async.elapse(delay);
      expect(repo.calls, 1);
      expect(notifier.state.total, 1);
      async.elapse(const Duration(hours: 1));
      expect(repo.calls, 2);
      notifier.dispose();
    });
  });
}
