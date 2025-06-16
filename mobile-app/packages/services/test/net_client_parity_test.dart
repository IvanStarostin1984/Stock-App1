import 'package:test/test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';

void main() {
  test('ledger increments again after cache expiry', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(2, const Duration(milliseconds: 50));
    final client = NetClient(ledger, MockClient((_) async {
      calls++;
      return http.Response('1', 200);
    }));
    final cache = LruCache<String, int>(1);

    await client.get<int>('u', cache, (j) => int.parse(j),
        ttl: const Duration(milliseconds: 5));
    await Future.delayed(const Duration(milliseconds: 10));
    await client.get<int>('u', cache, (j) => int.parse(j),
        ttl: const Duration(milliseconds: 5));

    expect(calls, 2);
    expect(ledger.isSafe(), isTrue);
  });

  test('skips request when ledger disallows', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(0, const Duration(milliseconds: 50));
    final client = NetClient(ledger, MockClient((_) async {
      calls++;
      return http.Response('1', 200);
    }));
    final cache = LruCache<String, int>(1);

    final res = await client.get<int>('u', cache, (j) => int.parse(j),
        ttl: const Duration(milliseconds: 5));

    expect(res, isNull);
    expect(calls, 0);
  });
}
