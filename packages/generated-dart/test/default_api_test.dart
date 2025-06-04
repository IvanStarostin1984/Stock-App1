import 'package:test/test.dart';
import 'package:openapi/openapi.dart';


/// tests for DefaultApi
void main() {
  final instance = Openapi().getDefaultApi();

  group(DefaultApi, () {
    // Get news
    //
    //Future<BuiltList<NewsArticle>> newsGet(String symbol) async
    test('test newsGet', () async {
      // TODO
    });

    // Get quote
    //
    //Future<Quote> quoteGet(String symbol) async
    test('test quoteGet', () async {
      // TODO
    });

  });
}
