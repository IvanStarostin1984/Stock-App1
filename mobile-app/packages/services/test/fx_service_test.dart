import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/fetch_json.dart';
import 'package:test/test.dart';

void main() {
  test('getRate returns parsed value', () async {
    final client = NetClient(MockClient((req) async => http.Response(
        jsonEncode({
          'rates': {'EUR': 1.1}
        }),
        200)));
    final svc = FxService(client);
    final rate = await svc.getRate('USD', 'EUR');
    expect(rate, 1.1);
  });

  test('getRate returns null on failure', () async {
    final client = NetClient(MockClient((req) async => http.Response('', 500)));
    final svc = FxService(client);
    final rate = await svc.getRate('USD', 'EUR');
    expect(rate, isNull);
  });
}
