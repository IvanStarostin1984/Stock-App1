import 'package:test/test.dart';
import 'package:openapi/openapi.dart';

/// Basic checks for the generated NewsArticle model
void main() {
  group('NewsArticle', () {
    test('can be built', () {
      final article = NewsArticle((b) => b
        ..title = 'Foo'
        ..url = 'http://example.com');
      expect(article.title, 'Foo');
      expect(article.url, 'http://example.com');
    });
  });
}
