import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('getRate returns stub value', () async {
    final svc = FxService();
    final rate = await svc.getRate('USD', 'EUR');
    expect(rate['rate'], 1.1);
  });
}
