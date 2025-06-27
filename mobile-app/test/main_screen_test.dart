import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/main/main_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_app/state/app_state.dart';
import 'package:smwa_services/services.dart';
import 'package:mobile_app/repositories/quote_repository.dart';
import 'package:mobile_app/repositories/news_repository.dart';
import 'package:mobile_app/models/news_article.dart';

class _FakeMarketstackService extends MarketstackService {
  @override
  Future<Map<String, dynamic>> getIndexQuote(String symbol) async {
    return {
      'symbol': symbol,
      'price': 1.5,
      'open': 1.4,
      'high': 1.6,
      'low': 1.3,
      'close': 1.5,
    };
  }
}

class _NullMarketstackService extends MarketstackService {
  @override
  Future<Map<String, dynamic>> getIndexQuote(String symbol) async {
    return {};
  }
}

class _FakeNewsRepository implements NewsRepository {
  @override
  Future<List<NewsArticle>?> digest(String symbol) async => [];
}

void main() {
  group('MainScreen', () {
    testWidgets('shows quote when service returns data', (tester) async {
      final repo = QuoteRepository(service: _FakeMarketstackService());
      final notifier =
          AppStateNotifier(quotes: repo, news: _FakeNewsRepository());
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
      final repo = QuoteRepository(service: _NullMarketstackService());
      final notifier =
          AppStateNotifier(quotes: repo, news: _FakeNewsRepository());
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
