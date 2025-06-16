import 'country_setting.dart';

abstract class CountrySettingRepository {
  Future<void> save(CountrySetting setting);
  Future<CountrySetting?> load();
}
