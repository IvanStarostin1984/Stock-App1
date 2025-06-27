import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/repositories/fx_repository.dart';
import 'package:smwa_services/services.dart';

class _FakeFxService extends FxService {
  int calls = 0;
  double? response;
  _FakeFxService({this.response});

  @override
  Future<double?> getRate(String from, String to) async {
    calls++;
    return response;
  }
}

void main() {
  group('FxRepository.rate', () {
    test('returns rate on success', () async {
      final svc = _FakeFxService(response: 1.1);
      final repo = FxRepository(service: svc);
      final rate = await repo.rate('USD', 'EUR');
      expect(rate, 1.1);
      expect(svc.calls, 1);
    });

    test('uses cache on repeat', () async {
      final svc = _FakeFxService(response: 1.2);
      final repo = FxRepository(service: svc);
      final first = await repo.rate('USD', 'EUR');
      final second = await repo.rate('USD', 'EUR');
      expect(first, same(second));
      expect(svc.calls, 1);
    });

    test('returns null on failure', () async {
      final svc = _FakeFxService(response: null);
      final repo = FxRepository(service: svc);
      final rate = await repo.rate('USD', 'EUR');
      expect(rate, isNull);
    });
  });
}
