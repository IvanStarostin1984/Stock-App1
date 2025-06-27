import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/repositories/news_repository.dart';
import 'package:smwa_services/services.dart';

class _FakeNewsService extends NewsService {
  int calls = 0;
  List<Map<String, dynamic>>? response;
  _FakeNewsService({this.response}) : super('k');

  @override
  Future<List<Map<String, dynamic>>?> getDigest(String topic) async {
    calls++;
    return response;
  }
}

void main() {
  group('NewsRepository.digest', () {
    test('returns articles on success', () async {
      final svc = _FakeNewsService(response: [
        {
          'title': 't',
          'url': 'u',
          'source': 's',
          'published': '2024-01-01T00:00:00Z'
        }
      ]);
      final repo = NewsRepository(service: svc);
      final list = await repo.digest('a');
      expect(list?.first.title, 't');
      expect(svc.calls, 1);
    });

    test('uses cache on repeat', () async {
      final svc = _FakeNewsService(response: [
        {
          'title': 't',
          'url': 'u',
          'source': 's',
          'published': '2024-01-01T00:00:00Z'
        }
      ]);
      final repo = NewsRepository(service: svc);
      final first = await repo.digest('a');
      final second = await repo.digest('a');
      expect(first, same(second));
      expect(svc.calls, 1);
    });

    test('returns null on failure', () async {
      final svc = _FakeNewsService(response: null);
      final repo = NewsRepository(service: svc);
      final list = await repo.digest('a');
      expect(list, isNull);
    });
  });
}
