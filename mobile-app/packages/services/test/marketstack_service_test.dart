import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/fetch_json.dart' as net;
import 'package:test/test.dart';

void main() {
  tearDown(() => net.httpClient = http.Client());

  test('getIndexQuote returns parsed value', () async {
    net.httpClient = MockClient((req) async => http.Response(
        jsonEncode({
          'data': [
            {'symbol': 'AAPL', 'close': 123.45}
          ]
        }),
        200));
    final svc = MarketstackService();
    final quote = await svc.getIndexQuote('AAPL');
    expect(quote?['symbol'], 'AAPL');
    expect(quote?['price'], 123.45);
  });

  test('getIndexQuote returns null on failure', () async {
    net.httpClient = MockClient((req) async => http.Response('', 500));
    final svc = MarketstackService();
    final quote = await svc.getIndexQuote('AAPL');
    expect(quote, isNull);
  });
}
