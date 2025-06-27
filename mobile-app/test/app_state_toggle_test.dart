import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/state/app_state.dart';
import 'package:mobile_app/repositories/fx_repository.dart';

class _FakeFxRepository implements FxRepository {
  int calls = 0;
  double? response;
  _FakeFxRepository({this.response});

  @override
  Future<double?> rate(String base, String quote) async {
    calls++;
    return response;
  }
}

void main() {
  group('AppStateNotifier.toggleCurrency', () {
    test('updates currency when rate returned', () async {
      final repo = _FakeFxRepository(response: 1.1);
      final notifier = AppStateNotifier(fxRepo: repo);
      await notifier.toggleCurrency();
      expect(notifier.state.currency, 'EUR');
      expect(repo.calls, 1);
    });

    test('keeps currency on null rate', () async {
      final repo = _FakeFxRepository(response: null);
      final notifier = AppStateNotifier(fxRepo: repo);
      await notifier.toggleCurrency();
      expect(notifier.state.currency, 'USD');
    });
  });
}
