import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('getDigest returns stub list', () async {
    final svc = NewsService();
    final news = await svc.getDigest('stocks');
    expect(news.first['title'], 'Example');
  });
}
