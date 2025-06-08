import 'package:smwa_services/services.dart';
import 'package:test/test.dart';

void main() {
  test('getIndexQuote returns stub value', () async {
    final svc = MarketstackService();
    final quote = await svc.getIndexQuote('AAPL');
    expect(quote['symbol'], 'AAPL');
    expect(quote['price'], 123.45);
  });
}
