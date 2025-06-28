import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:smwa_services/services.dart' as repo;
import '../models/country_setting.dart';

class CountrySettingRepository implements repo.CountrySettingRepository {
  static const _key = 'country_setting';

  @override
  Future<void> save(CountrySetting setting) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, json.encode(setting.toJson()));
  }

  @override
  Future<CountrySetting?> load() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_key);
    if (stored == null) return null;
    final data = json.decode(stored) as Map<String, dynamic>;
    return CountrySetting.fromJson(data);
  }
}
