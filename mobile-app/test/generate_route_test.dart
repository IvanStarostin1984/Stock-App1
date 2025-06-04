import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/main.dart';

void main() {
  group('generateRoute', () {
    testWidgets('resolves detail route with symbol', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(onGenerateRoute: generateRoute, initialRoute: '/'),
      );
      Navigator.pushNamed(
        tester.element(find.byType(MaterialApp)),
        '/detail/ABC',
      );
      await tester.pumpAndSettle();
      expect(find.text('Detail Screen (ABC)'), findsOneWidget);
    });

    testWidgets('throws for unknown route', (tester) async {
      await tester.pumpWidget(
        const MaterialApp(onGenerateRoute: generateRoute, initialRoute: '/'),
      );
      expect(
        () => Navigator.pushNamed(
          tester.element(find.byType(MaterialApp)),
          '/no-route',
        ),
        throwsA(isA<Exception>()),
      );
    });
  });
}
