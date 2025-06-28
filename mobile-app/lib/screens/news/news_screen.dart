import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Shows the latest market news articles.
class NewsScreen extends ConsumerWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    final articles = state.articles;
    return Scaffold(
      body: articles != null && articles.isNotEmpty
          ? ListView.builder(
              itemCount: articles.length,
              itemBuilder: (context, index) {
                final a = articles[index];
                return ListTile(
                  title: Text(a.title),
                  subtitle: Text(a.url),
                );
              },
            )
          : const Center(child: Text('No articles')),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            ref.read(appStateProvider.notifier).addToWatchList('AAPL'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
