import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/news/news_screen.dart';

void main() {
  group('NewsScreen', () {
    testWidgets('shows expected text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: NewsScreen()));
      expect(find.text('News Screen'), findsOneWidget);
    });

    testWidgets('does not show wrong text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: NewsScreen()));
      expect(find.text('Wrong'), findsNothing);
    });
  });
}
