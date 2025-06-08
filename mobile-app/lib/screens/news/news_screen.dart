import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Shows the latest market news articles.
class NewsScreen extends ConsumerWidget {
  const NewsScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    return Scaffold(
      body: Center(child: Text('News Screen: ${state.count}')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(appStateProvider.notifier).increment(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
