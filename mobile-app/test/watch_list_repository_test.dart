import 'package:flutter_test/flutter_test.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'package:mobile_app/repositories/watch_list_repository.dart';

void main() {
  TestWidgetsFlutterBinding.ensureInitialized();

  group('WatchListRepository', () {
    setUp(() {
      SharedPreferences.setMockInitialValues({});
    });

    test('saves and loads symbols', () async {
      final repo = WatchListRepository();
      await repo.save(['AAPL', 'GOOG']);
      final list = await repo.list();
      expect(list, ['AAPL', 'GOOG']);
    });

    test('returns empty list when no data', () async {
      final repo = WatchListRepository();
      final list = await repo.list();
      expect(list, isEmpty);
    });

    test('rejects invalid list', () async {
      final repo = WatchListRepository();
      expect(() => repo.save(['AAPL', '']), throwsArgumentError);
    });
  });
}
