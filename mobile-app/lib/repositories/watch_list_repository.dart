import 'dart:convert';
import 'package:shared_preferences/shared_preferences.dart';

/// R-04 – Persist watch-list symbols locally.
class WatchListRepository {
  static const _key = 'watch_list';

  /// Saves [list] of symbols to SharedPreferences.
  Future<void> save(List<String> list) async {
    if (list.any((s) => s.isEmpty)) {
      throw ArgumentError('Invalid watch list');
    }
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_key, json.encode(list));
  }

  /// Loads the saved watch list or an empty array.
  Future<List<String>> list() async {
    final prefs = await SharedPreferences.getInstance();
    final stored = prefs.getString(_key);
    if (stored == null) return [];
    final List<dynamic> data = json.decode(stored);
    return data.cast<String>();
  }
}
