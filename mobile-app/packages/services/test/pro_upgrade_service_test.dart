import 'dart:convert';
import 'package:smwa_services/services.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:test/test.dart';

class _Flag {
  bool value = false;
}

void main() {
  test('checkoutMock posts and updates store', () async {
    var method = '';
    final client = MockClient((req) async {
      method = req.method;
      expect(req.url.toString(),
          'http://localhost:12111/v1/checkout/sessions');
      return http.Response(jsonEncode({'status': 'open'}), 200);
    });
    final flag = _Flag();
    final svc = ProUpgradeService((v) async => flag.value = v, client: client);
    final ok = await svc.checkoutMock();
    expect(ok, isTrue);
    expect(method, 'POST');
    expect(flag.value, isTrue);
  });

  test('checkoutMock returns false on error', () async {
    final client = MockClient((req) async => http.Response('', 500));
    final flag = _Flag();
    final svc = ProUpgradeService((v) async => flag.value = v, client: client);
    final ok = await svc.checkoutMock();
    expect(ok, isFalse);
    expect(flag.value, isFalse);
  });
}
