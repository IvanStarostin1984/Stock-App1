import 'dart:convert';
import 'package:fake_async/fake_async.dart';
import 'package:smwa_services/services.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:test/test.dart';

class _Flag {
  bool value = false;
}

void main() {
  test('ledger increments again after window expiry', () {
    fakeAsync((async) {
      var calls = 0;
      final ledger = ApiQuotaLedger(1, const Duration(milliseconds: 50));
      final client = MockClient((req) async {
        calls++;
        expect(req.url.toString(),
            'http://localhost:12111/v1/checkout/sessions');
        return http.Response(jsonEncode({'status': 'open'}), 200);
      });
      final flag = _Flag();
      final svc = ProUpgradeService((v) async => flag.value = v,
          ledger: ledger, client: client);

      svc.checkoutMock().then(expectAsync1((ok) => expect(ok, isTrue)));
      async.elapse(const Duration());
      expect(flag.value, isTrue);
      expect(ledger.isSafe(), isFalse);

      async.elapse(const Duration(milliseconds: 60));
      expect(ledger.isSafe(), isTrue);

      svc.checkoutMock().then(expectAsync1((ok) => expect(ok, isTrue)));
      async.elapse(const Duration());
      expect(calls, 2);
      expect(ledger.isSafe(), isFalse);
    });
  });

  test('returns false when ledger disallows', () {
    fakeAsync((async) {
      var called = false;
      final ledger = ApiQuotaLedger(0);
      final client = MockClient((req) async {
        called = true;
        return http.Response('', 200);
      });
      final flag = _Flag();
      final svc = ProUpgradeService((v) async => flag.value = v,
          ledger: ledger, client: client);

      svc.checkoutMock().then(expectAsync1((ok) => expect(ok, isFalse)));
      async.elapse(const Duration());
      expect(called, isFalse);
      expect(flag.value, isFalse);
    });
  });

  test('returns false on network error', () {
    fakeAsync((async) {
      final ledger = ApiQuotaLedger(1);
      final client = MockClient((req) async => http.Response('', 500));
      final flag = _Flag();
      final svc = ProUpgradeService((v) async => flag.value = v,
          ledger: ledger, client: client);

      svc.checkoutMock().then(expectAsync1((ok) => expect(ok, isFalse)));
      async.elapse(const Duration());
      expect(flag.value, isFalse);
    });
  });
}
