import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/portfolio/portfolio_screen.dart';

void main() {
  group('PortfolioScreen', () {
    testWidgets('shows expected text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: PortfolioScreen()));
      expect(find.text('Portfolio Screen'), findsOneWidget);
    });

    testWidgets('does not show wrong text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: PortfolioScreen()));
      expect(find.text('Wrong'), findsNothing);
    });
  });
}
