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

  test('ledger increments on successful request', () async {
    final ledger = ApiQuotaLedger(1);
    final client = MockClient((req) async => http.Response(
        jsonEncode({
          'results': [
            {'title': 't', 'link': 'l', 'source_id': 's', 'pubDate': 'p'}
          ]
        }),
        200));
    final svc = NewsService('k', ledger: ledger, client: client);
    await svc.getDigest('aa');
    expect(ledger.isSafe(), isFalse);
  });

  test('caches result for 12h', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(2);
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
    await svc.getDigest('aa');
    expect(calls, 1);
  });

  test('falls back to rss when api fails', () async {
    var calls = 0;
    final rss =
        '<?xml version="1.0"?><rss><channel><item><title>r</title><link>u</link><pubDate>d</pubDate></item></channel></rss>';
    final client = MockClient((req) async {
      calls++;
      if (calls == 1) return http.Response('', 500);
      return http.Response(rss, 200);
    });
    final svc = NewsService('k', ledger: ApiQuotaLedger(1), client: client);
    final news = await svc.getDigest('aa');
    expect(news?.first['title'], 'r');
    expect(calls, 2);
  });
}
