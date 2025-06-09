import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:mobile_app/screens/news/news_screen.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:mobile_app/state/app_state.dart';
import 'package:mobile_app/models/news_article.dart';

void main() {
  group('NewsScreen', () {
    testWidgets('displays article titles and urls', (tester) async {
      final notifier = AppStateNotifier();
      notifier.state = AppState(articles: [
        NewsArticle(
            title: 't1',
            url: 'u1',
            source: 's',
            published: DateTime.parse('2024-01-01T00:00:00Z'))
      ]);
      await tester.pumpWidget(
        ProviderScope(
          overrides: [appStateProvider.overrideWith((ref) => notifier)],
          child: const MaterialApp(home: NewsScreen()),
        ),
      );
      expect(find.text('t1'), findsOneWidget);
      expect(find.text('u1'), findsOneWidget);
    });

    testWidgets('shows placeholder when no articles', (tester) async {
      final notifier = AppStateNotifier();
      notifier.state = const AppState(articles: []);
      await tester.pumpWidget(
        ProviderScope(
          overrides: [appStateProvider.overrideWith((ref) => notifier)],
          child: const MaterialApp(home: NewsScreen()),
        ),
      );
      expect(find.text('No articles'), findsOneWidget);
    });
  });
}
