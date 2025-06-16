import 'package:test/test.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';

void main() {
  test('caches successful responses', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(1);
    final client = NetClient(ledger, MockClient((_) async {
      calls++;
      return http.Response('3', 200);
    }));
    final cache = LruCache<String, int>(1);

    final first = await client.get<int>('u', cache, (j) => int.parse(j));
    final second = await client.get<int>('u', cache, (j) => int.parse(j));

    expect(first, 3);
    expect(second, 3);
    expect(calls, 1);
  });

  test('respects quota ledger', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(0); // not safe
    final client = NetClient(ledger, MockClient((_) async {
      calls++;
      return http.Response('3', 200);
    }));
    final cache = LruCache<String, int>(1);

    final res = await client.get<int>('u', cache, (j) => int.parse(j));

    expect(res, isNull);
    expect(calls, 0);
  });

  test('does not cache failed requests', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(1);
    final client = NetClient(ledger, MockClient((_) async {
      calls++;
      return http.Response('', 500);
    }));
    final cache = LruCache<String, int>(1);

    final res1 = await client.get<int>('u', cache, (j) => int.parse(j));
    final res2 = await client.get<int>('u', cache, (j) => int.parse(j));

    expect(res1, isNull);
    expect(res2, isNull);
    expect(calls, 2);
  });

  test('cache expires after ttl', () async {
    var calls = 0;
    final ledger = ApiQuotaLedger(2);
    final client = NetClient(ledger, MockClient((_) async {
      calls++;
      return http.Response('3', 200);
    }));
    final cache = LruCache<String, int>(1);

    await client.get<int>('u', cache, (j) => int.parse(j),
        ttl: const Duration(milliseconds: 1));
    await Future.delayed(const Duration(milliseconds: 2));
    await client.get<int>('u', cache, (j) => int.parse(j),
        ttl: const Duration(milliseconds: 1));

    expect(calls, 2);
  });
}
