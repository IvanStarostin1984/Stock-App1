import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/pro/pro_screen.dart';

void main() {
  group('ProScreen', () {
    testWidgets('shows expected text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: ProScreen()));
      expect(find.text('Pro Screen'), findsOneWidget);
    });

    testWidgets('does not show wrong text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: ProScreen()));
      expect(find.text('Wrong'), findsNothing);
    });
  });
}
