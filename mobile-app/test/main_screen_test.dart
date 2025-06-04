import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/main/main_screen.dart';

void main() {
  group('MainScreen', () {
    testWidgets('shows expected text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: MainScreen()));
      expect(find.text('Main Screen'), findsOneWidget);
    });

    testWidgets('does not show wrong text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: MainScreen()));
      expect(find.text('Wrong'), findsNothing);
    });
  });
}
