import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Displays detailed information about a stock.
class DetailScreen extends ConsumerWidget {
  const DetailScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    return Scaffold(
      body: Center(child: Text('Detail Screen: ${state.count}')),
      floatingActionButton: FloatingActionButton(
        onPressed: () =>
            ref.read(appStateProvider.notifier).addToWatchList('AAPL'),
        child: const Icon(Icons.add),
      ),
    );
  }
}
