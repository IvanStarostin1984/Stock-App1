import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('resolveCountry returns stub', () async {
    final svc = LocationService();
    final c = await svc.resolveCountry();
    expect(c['iso2'], 'US');
  });
}
