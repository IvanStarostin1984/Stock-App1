import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../state/app_state.dart';

/// Displays the user's stock portfolio.
class PortfolioScreen extends ConsumerWidget {
  const PortfolioScreen({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final state = ref.watch(appStateProvider);
    return Scaffold(
      body: Center(child: Text('Portfolio Screen: ${state.count}')),
      floatingActionButton: FloatingActionButton(
        onPressed: () => ref.read(appStateProvider.notifier).increment(),
        child: const Icon(Icons.add),
      ),
    );
  }
}
