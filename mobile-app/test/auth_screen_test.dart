import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/auth/auth_screen.dart';

void main() {
  group('AuthScreen', () {
    testWidgets('shows expected text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: AuthScreen()));
      expect(find.text('Auth Screen'), findsOneWidget);
    });

    testWidgets('does not show wrong text', (tester) async {
      await tester.pumpWidget(const MaterialApp(home: AuthScreen()));
      expect(find.text('Wrong'), findsNothing);
    });
  });
}
