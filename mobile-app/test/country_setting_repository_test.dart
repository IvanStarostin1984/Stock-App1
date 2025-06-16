import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_app/models/country_setting.dart';
import 'package:mobile_app/repositories/country_setting_repository.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('CountrySettingRepository', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('saves and loads setting', () async {
      final repo = CountrySettingRepository();
      final setting = CountrySetting(
        iso2: 'US',
        lastCurrency: 'USD',
        acquired: DateTime.utc(2024, 1, 1),
        method: 'GPS',
      );
      await repo.save(setting);
      final loaded = await repo.load();
      expect(loaded?.iso2, 'US');
      expect(loaded?.lastCurrency, 'USD');
    });

    test('load returns null when empty', () async {
      final repo = CountrySettingRepository();
      final loaded = await repo.load();
      expect(loaded, isNull);
    });
  });
}
