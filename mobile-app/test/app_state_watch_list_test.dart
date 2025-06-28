import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/state/app_state.dart';
import 'package:mobile_app/repositories/watch_list_repository.dart';

class _FakeRepo extends WatchListRepository {
  List<String> _items;
  _FakeRepo(this._items);
  @override
  Future<List<String>> list() async => List.from(_items);
  @override
  Future<void> save(List<String> list) async {
    _items = List.from(list);
  }
}

void main() {
  group('AppStateNotifier watch list actions', () {
    test('addToWatchList adds when missing', () async {
      final repo = _FakeRepo(['AAPL']);
      final notifier = AppStateNotifier(watchRepo: repo);
      await notifier.addToWatchList('GOOG');
      expect(repo._items, ['AAPL', 'GOOG']);
    });

    test('addToWatchList skips existing', () async {
      final repo = _FakeRepo(['AAPL']);
      final notifier = AppStateNotifier(watchRepo: repo);
      await notifier.addToWatchList('AAPL');
      expect(repo._items, ['AAPL']);
    });

    test('removeFromWatchList removes symbol', () async {
      final repo = _FakeRepo(['AAPL', 'GOOG']);
      final notifier = AppStateNotifier(watchRepo: repo);
      await notifier.removeFromWatchList('GOOG');
      expect(repo._items, ['AAPL']);
    });
  });
}
