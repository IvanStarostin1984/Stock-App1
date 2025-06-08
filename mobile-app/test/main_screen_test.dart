import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/main/main_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_app/state/app_state.dart';
import 'package:smwa_services/services.dart';

class _FakeMarketstackService extends MarketstackService {
  @override
  Future<Map<String, dynamic>> getIndexQuote(String symbol) async {
    return {'symbol': symbol, 'price': 1.5};
  }
}

class _NullMarketstackService extends MarketstackService {
  @override
  Future<Map<String, dynamic>> getIndexQuote(String symbol) async {
    return {};
  }
}

class _FakeNewsService extends NewsService {
  @override
  Future<List<Map<String, dynamic>>> getDigest(String topic) async {
    return [];
  }
}

void main() {
  group('MainScreen', () {
    testWidgets('shows quote when service returns data', (tester) async {
      final notifier = AppStateNotifier(
          marketstack: _FakeMarketstackService(), news: _FakeNewsService());
      await tester.pumpWidget(
        ProviderScope(
          overrides: [appStateProvider.overrideWith((ref) => notifier)],
          child: const MaterialApp(home: MainScreen()),
        ),
      );
      await tester.pump();
      expect(find.text('AAPL: 1.5'), findsOneWidget);
    });

    testWidgets('shows loading when service returns null', (tester) async {
      final notifier = AppStateNotifier(
          marketstack: _NullMarketstackService(), news: _FakeNewsService());
      await tester.pumpWidget(
        ProviderScope(
          overrides: [appStateProvider.overrideWith((ref) => notifier)],
          child: const MaterialApp(home: MainScreen()),
        ),
      );
      await tester.pump();
      expect(find.text('Loading...'), findsOneWidget);
    });
  });
}
