import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_app/screens/portfolio/portfolio_screen.dart';
import 'package:mobile_app/state/portfolio_state.dart';
import 'package:mobile_app/models/portfolio_holding.dart';
import 'package:mobile_app/repositories/portfolio_repository.dart';

class _FakeRepo extends PortfolioRepository {
  final List<PortfolioHolding> _items;
  final double _total;
  _FakeRepo(this._items, this._total);
  @override
  Future<List<PortfolioHolding>> list() async => _items;
  @override
  Future<double> refreshTotals() async => _total;
}

class _MutRepo extends PortfolioRepository {
  List<PortfolioHolding> items;
  int addCalls = 0;
  int removeCalls = 0;
  _MutRepo(this.items);

  @override
  Future<List<PortfolioHolding>> list() async => List.from(items);

  @override
  Future<double> refreshTotals() async =>
      items.fold<double>(0, (t, h) => t + h.quantity * h.buyPrice);

  @override
  Future<void> add(PortfolioHolding h) async {
    addCalls++;
    items.add(h);
  }

  @override
  Future<void> remove(String id) async {
    removeCalls++;
    items.removeWhere((e) => e.id == id);
  }
}

void main() {
  group('PortfolioScreen', () {
    testWidgets('lists holdings and shows total', (tester) async {
      final repo = _FakeRepo(
        [
          PortfolioHolding(
            id: '1',
            symbol: 'AAPL',
            quantity: 2,
            buyPrice: 1,
            added: DateTime.utc(2024, 1, 1),
          )
        ],
        3,
      );
      final notifier = PortfolioNotifier(repo: repo);
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            portfolioNotifierProvider.overrideWith((ref) => notifier),
          ],
          child: const MaterialApp(home: PortfolioScreen()),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('AAPL'), findsOneWidget);
      expect(find.textContaining('Total: 3.00'), findsOneWidget);
    });

    testWidgets('shows placeholder when no holdings', (tester) async {
      final repo = _FakeRepo(const [], 0);
      final notifier = PortfolioNotifier(repo: repo);
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            portfolioNotifierProvider.overrideWith((ref) => notifier),
          ],
          child: const MaterialApp(home: PortfolioScreen()),
        ),
      );
      await tester.pumpAndSettle();
      expect(find.text('No holdings'), findsOneWidget);
      expect(find.textContaining('Total:'), findsOneWidget);
    });

    testWidgets('adds holding on FAB tap', (tester) async {
      final repo = _MutRepo([]);
      final notifier = PortfolioNotifier(repo: repo);
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            portfolioNotifierProvider.overrideWith((ref) => notifier),
          ],
          child: const MaterialApp(home: PortfolioScreen()),
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pumpAndSettle();
      expect(repo.addCalls, 1);
      expect(find.byType(ListTile), findsOneWidget);
    });

    testWidgets('removes holding on delete tap', (tester) async {
      final item = PortfolioHolding(
        id: '1',
        symbol: 'AAPL',
        quantity: 1,
        buyPrice: 1,
        added: DateTime.utc(2024, 1, 1),
      );
      final repo = _MutRepo([item]);
      final notifier = PortfolioNotifier(repo: repo);
      await tester.pumpWidget(
        ProviderScope(
          overrides: [
            portfolioNotifierProvider.overrideWith((ref) => notifier),
          ],
          child: const MaterialApp(home: PortfolioScreen()),
        ),
      );
      await tester.pumpAndSettle();
      await tester.tap(find.byIcon(Icons.delete));
      await tester.pumpAndSettle();
      expect(repo.removeCalls, 1);
      expect(find.text('No holdings'), findsOneWidget);
    });
  });
}
