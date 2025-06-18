import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('throws for empty api key', () {
    expect(() => NewsService(''), throwsArgumentError);
  });
  test('getDigest returns parsed list', () async {
    final client = MockClient((req) async => http.Response(
        jsonEncode({
          'results': [
            {'title': 'Example', 'link': 'https://x.com'}
          ]
        }),
        200));
    final svc = NewsService('k', client: client);
    final news = await svc.getDigest('stocks');
    expect(news?.first['title'], 'Example');
  });

  test('getDigest returns null on failure', () async {
    final client = MockClient((req) async => http.Response('', 500));
    final svc = NewsService('k', client: client);
    final news = await svc.getDigest('stocks');
    expect(news, isNull);
  });

  test('getDigest caches result for 12h', () async {
    var calls = 0;
    final client = MockClient((req) async {
      calls++;
      return http.Response(
          jsonEncode({
            'results': [
              {'title': 'Example', 'link': 'https://x.com'}
            ]
          }),
          200);
    });
    final svc = NewsService('k', client: client);
    await svc.getDigest('stocks');
    await svc.getDigest('stocks');
    expect(calls, 1);
  });

  test('falls back to rss on failure', () async {
    var calls = 0;
    final rss =
        '''<rss><channel><item><title>r</title><link>l</link><pubDate>p</pubDate></item></channel></rss>''';
    final client = MockClient((req) async {
      calls++;
      if (calls == 1) {
        return http.Response('', 500);
      }
      return http.Response(rss, 200);
    });
    final svc = NewsService('k', client: client);
    final news = await svc.getDigest('stocks');
    expect(news?.first['title'], 'r');
    expect(calls, 2);
  });

  test('returns null when rss also fails', () async {
    final client = MockClient((req) async => http.Response('', 500));
    final svc = NewsService('k', client: client);
    final news = await svc.getDigest('stocks');
    expect(news, isNull);
  });
}
