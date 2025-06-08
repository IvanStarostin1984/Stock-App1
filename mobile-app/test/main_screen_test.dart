import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/main/main_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';

void main() {
  group('MainScreen', () {
    testWidgets('shows expected text', (tester) async {
      await tester.pumpWidget(
          const ProviderScope(child: MaterialApp(home: MainScreen())));
      expect(find.text('Main Screen: 0'), findsOneWidget);
    });

    testWidgets('does not show wrong text', (tester) async {
      await tester.pumpWidget(
          const ProviderScope(child: MaterialApp(home: MainScreen())));
      expect(find.text('Wrong'), findsNothing);
    });

    testWidgets('increment button increases count', (tester) async {
      await tester.pumpWidget(
          const ProviderScope(child: MaterialApp(home: MainScreen())));
      await tester.tap(find.byType(FloatingActionButton));
      await tester.pump();
      expect(find.text('Main Screen: 1'), findsOneWidget);
    });

    testWidgets('negative case – count not incremented without tap',
        (tester) async {
      await tester.pumpWidget(
          const ProviderScope(child: MaterialApp(home: MainScreen())));
      expect(find.text('Main Screen: 1'), findsNothing);
    });
  });
}
