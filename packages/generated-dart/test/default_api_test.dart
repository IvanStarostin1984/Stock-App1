import 'package:test/test.dart';
import 'package:openapi/openapi.dart';

/// Minimal sanity checks for the generated API client
void main() {
  group('DefaultApi', () {
    test('can be constructed', () {
      final api = Openapi().getDefaultApi();
      expect(api, isA<DefaultApi>());
    });
  });
}
