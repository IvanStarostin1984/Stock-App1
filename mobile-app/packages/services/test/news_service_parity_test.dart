import 'dart:convert';
import 'package:test/test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';

void main() {
  test('ledger increments again after window expiry', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(1, const Duration(milliseconds: 50));
    final client = MockClient((req) async {
      calls++;
      return http.Response(
          jsonEncode({
            'results': [
              {'title': 't', 'link': 'l', 'source_id': 's', 'pubDate': 'p'}
            ]
          }),
          200);
    });
    final svc = NewsService('k', ledger: ledger, client: client);
    await svc.getDigest('aa');
    await Future.delayed(const Duration(milliseconds: 60));
    await svc.getDigest('bb');
    expect(calls, 2);
  });

  test('skips request when ledger disallows', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(0);
    final client = MockClient((req) async {
      calls++;
      return http.Response('', 200);
    });
    final svc = NewsService('k', ledger: ledger, client: client);
    final res = await svc.getDigest('aa');
    expect(res, isNull);
    expect(calls, 0);
  });
}
