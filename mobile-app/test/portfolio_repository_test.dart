import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_app/models/portfolio_holding.dart';
import 'package:mobile_app/repositories/portfolio_repository.dart';
import 'package:mobile_app/repositories/quote_repository.dart';
import 'package:mobile_app/models/quote.dart';

class _FakeQuoteRepo implements QuoteRepository {
  int calls = 0;
  final double price;
  _FakeQuoteRepo(this.price);

  @override
  Future<Quote?> headline([String symbol = 'AAPL']) async {
    calls++;
    return Quote(symbol: symbol, price: price);
  }

  @override
  Future<List<Quote>?> series(String symbol) async => [];
}

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();
  const sample = PortfolioHolding(
    id: '1',
    symbol: 'AAPL',
    quantity: 2,
    buyPrice: 100,
    added: const DateTime.utc(2024, 1, 1),
  );

  group('PortfolioRepository', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('adds and lists holdings', () async {
      final repo = PortfolioRepository(quoteRepo: _FakeQuoteRepo(1));
      await repo.add(sample);
      final list = await repo.list();
      expect(list.length, 1);
      expect(list.first.id, '1');
    });

    test('removes holdings by id', () async {
      final repo = PortfolioRepository(quoteRepo: _FakeQuoteRepo(1));
      await repo.add(sample);
      await repo.add(sample.copyWith(id: '2'));
      await repo.remove('1');
      final list = await repo.list();
      expect(list.length, 1);
      expect(list.first.id, '2');
    });

    test('rejects invalid holding', () async {
      final repo = PortfolioRepository(quoteRepo: _FakeQuoteRepo(1));
      expect(() async => repo.add(sample.copyWith(quantity: 0)), throwsArgumentError);
    });

    test('refreshTotals caches result', () async {
      final fake = _FakeQuoteRepo(2);
      final repo = PortfolioRepository(quoteRepo: fake);
      await repo.add(sample);
      final first = await repo.refreshTotals();
      final second = await repo.refreshTotals();
      expect(first, second);
      expect(fake.calls, 1);
    });
  });
}
