import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('getRate returns parsed value', () async {
    final client = MockClient((req) async => http.Response(
        jsonEncode({
          'rates': {'EUR': 1.1}
        }),
        200));
    final svc = FxService(client);
    final rate = await svc.getRate('USD', 'EUR');
    expect(rate, 1.1);
  });

  test('getRate returns null on failure', () async {
    final client = MockClient((req) async => http.Response('', 500));
    final svc = FxService(client);
    final rate = await svc.getRate('USD', 'EUR');
    expect(rate, isNull);
  });

  test('getRate caches result for 24h', () async {
    var calls = 0;
    final client = MockClient((req) async {
      calls++;
      return http.Response(
          jsonEncode({
            'rates': {'EUR': 1.2}
          }),
          200);
    });
    final svc = FxService(client);
    await svc.getRate('USD', 'EUR');
    await svc.getRate('USD', 'EUR');
    expect(calls, 1);
  });
}
