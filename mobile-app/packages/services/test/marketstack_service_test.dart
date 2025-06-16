import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('getIndexQuote returns parsed value', () async {
    final client = MockClient((req) async => http.Response(
        jsonEncode({
          'data': [
            {'symbol': 'AAPL', 'close': 123.45}
          ]
        }),
        200));
    final svc = MarketstackService(client);
    final quote = await svc.getIndexQuote('AAPL');
    expect(quote?['symbol'], 'AAPL');
    expect(quote?['price'], 123.45);
  });

  test('getIndexQuote returns null on failure', () async {
    final client = MockClient((req) async => http.Response('', 500));
    final svc = MarketstackService(client);
    final quote = await svc.getIndexQuote('AAPL');
    expect(quote, isNull);
  });

  test('getIndexQuote caches result for 24h', () async {
    var calls = 0;
    final client = MockClient((req) async {
      calls++;
      return http.Response(
          jsonEncode({
            'data': [
              {'symbol': 'AAPL', 'close': 1.0}
            ]
          }),
          200);
    });
    final svc = MarketstackService(client);
    await svc.getIndexQuote('AAPL');
    await svc.getIndexQuote('AAPL');
    expect(calls, 1);
  });
}
