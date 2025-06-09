import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/models/quote.dart';
import 'package:mobile_app/repositories/quote_repository.dart';
import 'package:smwa_services/services.dart';

class _FakeMarketstackService extends MarketstackService {
  int calls = 0;
  Map<String, dynamic>? response;
  List<Map<String, dynamic>>? seriesResponse;

  _FakeMarketstackService({this.response, this.seriesResponse});

  @override
  Future<Map<String, dynamic>?> getIndexQuote(String symbol) async {
    calls++;
    return response;
  }

  @override
  Future<List<Map<String, dynamic>>?> getSeries(String symbol) async {
    calls++;
    return seriesResponse;
  }
}

void main() {
  group('QuoteRepository.headline', () {
    test('returns Quote on success', () async {
      final svc = _FakeMarketstackService(response: {
        'symbol': 'AAPL',
        'price': 2.5,
      });
      final repo = QuoteRepository(service: svc);
      final q = await repo.headline('AAPL');
      expect(q, isA<Quote>());
      expect(q?.symbol, 'AAPL');
      expect(q?.price, 2.5);
      expect(svc.calls, 1);
    });

    test('uses cache on repeated call', () async {
      final svc = _FakeMarketstackService(response: {
        'symbol': 'AAPL',
        'price': 2.5,
      });
      final repo = QuoteRepository(service: svc);
      final first = await repo.headline('AAPL');
      final second = await repo.headline('AAPL');
      expect(first, same(second));
      expect(svc.calls, 1);
    });

    test('returns null on failure', () async {
      final svc = _FakeMarketstackService(response: null);
      final repo = QuoteRepository(service: svc);
      final q = await repo.headline('AAPL');
      expect(q, isNull);
    });
  });

  group('QuoteRepository.series', () {
    test('returns list of quotes', () async {
      final svc = _FakeMarketstackService(seriesResponse: [
        {'symbol': 'AAPL', 'close': 1.0},
        {'symbol': 'AAPL', 'close': 2.0}
      ]);
      final repo = QuoteRepository(service: svc);
      final list = await repo.series('AAPL');
      expect(list?.length, 2);
      expect(list?.first.price, 1.0);
      expect(svc.calls, 1);
    });

    test('uses cache for series', () async {
      final svc = _FakeMarketstackService(seriesResponse: [
        {'symbol': 'AAPL', 'close': 1.0},
      ]);
      final repo = QuoteRepository(service: svc);
      final first = await repo.series('AAPL');
      final second = await repo.series('AAPL');
      expect(first, same(second));
      expect(svc.calls, 1);
    });

    test('returns null on series failure', () async {
      final svc = _FakeMarketstackService(seriesResponse: null);
      final repo = QuoteRepository(service: svc);
      final list = await repo.series('AAPL');
      expect(list, isNull);
    });
  });
}
