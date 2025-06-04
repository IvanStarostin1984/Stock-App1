import 'package:test/test.dart';
import 'package:openapi/openapi.dart';

/// Basic checks for the generated Quote model
void main() {
  group('Quote', () {
    test('can be built', () {
      final quote = Quote((b) => b
        ..symbol = 'FOO'
        ..price = 1.23);
      expect(quote.symbol, 'FOO');
      expect(quote.price, closeTo(1.23, 0.001));
    });
  });
}
