import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';
import 'package:smwa_services/services.dart';
import 'package:smwa_services/src/fetch_json.dart';
import 'package:test/test.dart';

void main() {
  test('getDigest returns parsed list', () async {
    final client = NetClient(MockClient((req) async => http.Response(
        jsonEncode({
          'results': [
            {'title': 'Example', 'link': 'https://x.com'}
          ]
        }),
        200)));
    final svc = NewsService(client);
    final news = await svc.getDigest('stocks');
    expect(news?.first['title'], 'Example');
  });

  test('getDigest returns null on failure', () async {
    final client = NetClient(MockClient((req) async => http.Response('', 500)));
    final svc = NewsService(client);
    final news = await svc.getDigest('stocks');
    expect(news, isNull);
  });
}
